import { Request, Response } from "express";
import Wishlist from "../models/wishlist.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";


export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user?._id }).populate("products");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user?._id, products: [] });
  }
  sendResponse(res, { message: "Wishlist fetched", data: wishlist, statusCode: 200 });
});


export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user?._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user?._id, products: [] });
  }

  const alreadyIn = wishlist.products.some((p) => String(p) === productId);
  if (!alreadyIn) {
    wishlist.products.push(productId as any);
    await wishlist.save();
  }

  await wishlist.populate("products");
  sendResponse(res, { message: "Added to wishlist", data: wishlist, statusCode: 200 });
});


export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user?._id });
  if (!wishlist) throw new ApiError("Wishlist not found", 404);

  wishlist.products = wishlist.products.filter((p) => String(p) !== productId) as any;
  await wishlist.save();
  await wishlist.populate("products");

  sendResponse(res, { message: "Removed from wishlist", data: wishlist, statusCode: 200 });
});