import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { getPagination, buildMeta } from "../utils/pagination.utils";
import { OrderStatus, Role } from "../types/enum.types";

const SHIPPING_FEE = 5;

/**
 * POST /api/v1/orders
 * Purpose: turn the logged-in user's current cart into an order (checkout).
 * Auth: required.
 * Body: { shipping_address: {...}, payment_method: "cod" | "card" }
 * Validation: cart must not be empty; every item must still have enough stock.
 * Side effects: decrements product stock, clears the cart.
 * Response: 201 with the created order.
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shipping_address, payment_method } = req.body;

  if (!shipping_address) throw new ApiError("shipping_address is required", 400);
  const required = ["full_name", "line1", "city", "state", "postal_code", "country", "phone"];
  for (const field of required) {
    if (!shipping_address[field]) throw new ApiError(`shipping_address.${field} is required`, 400);
  }

  const cart = await Cart.findOne({ user: req.user?._id }).populate("items.product");
  if (!cart || cart.items.length === 0) throw new ApiError("Your cart is empty", 400);

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product as any;
    if (!product) continue;
    if (item.quantity > product.stock) {
      throw new ApiError(`"${product.name}" only has ${product.stock} unit(s) left`, 400);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images?.[0]?.url,
    });
    subtotal += product.price * item.quantity;
  }

  if (orderItems.length === 0) throw new ApiError("Your cart is empty", 400);

  const total = subtotal + SHIPPING_FEE;

  const order = await Order.create({
    user: req.user?._id,
    items: orderItems,
    shipping_address,
    payment_method: payment_method === "card" ? "card" : "cod",
    subtotal,
    shipping_fee: SHIPPING_FEE,
    total,
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }),
    ),
  );

  cart.items = [] as any;
  await cart.save();

  sendResponse(res, { message: "Order placed successfully", data: order, statusCode: 201 });
});

/**
 * GET /api/v1/orders
 * Purpose: list orders. Customers see only their own; admins can see all.
 * Query: page, limit, status? (admin only filter)
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === Role.ADMIN;
  const filter: Record<string, any> = isAdmin ? {} : { user: req.user?._id };
  if (isAdmin && req.query.status) filter.status = req.query.status;

  const { currentPage, pageSize, skip } = getPagination(
    req.query.page as string,
    req.query.limit as string,
  );

  let query = Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
  if (isAdmin) query = query.populate("user", "full_name email");

  const [orders, totalCount] = await Promise.all([query, Order.countDocuments(filter)]);

  sendResponse(res, {
    message: "Orders fetched",
    data: orders,
    statusCode: 200,
    meta: buildMeta(totalCount, currentPage, pageSize),
  });
});

/**
 * GET /api/v1/orders/:id
 * Purpose: fetch a single order's full detail.
 * Auth: required. A customer can only view their own order; an admin can view any.
 */
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("user", "full_name email");
  if (!order) throw new ApiError("Order not found", 404);

  const isOwner = String(order.user._id || order.user) === String(req.user?._id);
  if (!isOwner && req.user?.role !== Role.ADMIN) {
    throw new ApiError("Forbidden. You cannot view this order.", 403);
  }

  sendResponse(res, { message: "Order fetched", data: order, statusCode: 200 });
});

/**
 * PATCH /api/v1/orders/:id/status  (admin only)
 * Purpose: move an order forward through its lifecycle.
 * Body: { status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" }
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!Object.values(OrderStatus).includes(status)) {
    throw new ApiError("Invalid order status", 400);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true, runValidators: true },
  );
  if (!order) throw new ApiError("Order not found", 404);

  sendResponse(res, { message: "Order status updated", data: order, statusCode: 200 });
});
