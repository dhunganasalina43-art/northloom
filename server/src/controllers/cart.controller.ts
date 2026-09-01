import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ user: req.user?._id }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: req.user?._id, items: [] });
  }
  sendResponse(res, { message: "Cart fetched", data: cart, statusCode: 200 });
});

/**
 * POST /api/v1/cart/items
 * Body: { product_id, quantity?, size?, color? }
 * A cart line is unique per (product, size, color) combination - adding
 * the same product with a different size/color creates a separate line.
 */
export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { product_id, quantity = 1, size, color } = req.body;
  if (!product_id) throw new ApiError("product_id is required", 400);

  const product = await Product.findById(product_id);
  if (!product) throw new ApiError("Product not found", 404);

  let cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) cart = new Cart({ user: req.user?._id, items: [] });

  const existingItem = cart.items.find(
    (i) =>
      String(i.product) === String(product_id) &&
      (i.size || "") === (size || "") &&
      (i.color || "") === (color || ""),
  );
  const nextQuantity = (existingItem?.quantity || 0) + Number(quantity);

  if (nextQuantity > product.stock) {
    throw new ApiError(`Only ${product.stock} unit(s) left in stock`, 400);
  }

  if (existingItem) {
    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({ product: product_id, quantity: Number(quantity), size, color } as any);
  }

  await cart.save();
  await cart.populate("items.product");

  sendResponse(res, { message: "Item added to cart", data: cart, statusCode: 200 });
});

export const updateItemQuantity = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) throw new ApiError("quantity must be at least 1", 400);

  const cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) throw new ApiError("Cart not found", 404);

  const item = cart.items.find((i) => String(i._id) === req.params.itemId);
  if (!item) throw new ApiError("Cart item not found", 404);

  const product = await Product.findById(item.product);
  if (product && quantity > product.stock) {
    throw new ApiError(`Only ${product.stock} unit(s) left in stock`, 400);
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");

  sendResponse(res, { message: "Cart item updated", data: cart, statusCode: 200 });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) throw new ApiError("Cart not found", 404);

  cart.items = cart.items.filter((i) => String(i._id) !== req.params.itemId) as any;
  await cart.save();
  await cart.populate("items.product");

  sendResponse(res, { message: "Item removed from cart", data: cart, statusCode: 200 });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user?._id },
    { $set: { items: [] } },
    { new: true },
  );
  sendResponse(res, { message: "Cart cleared", data: cart, statusCode: 200 });
});
