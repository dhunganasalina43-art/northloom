import { Request, Response } from "express";
import Review from "../models/review.model";
import Product from "../models/product.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";


const recalculateProductRating = async (productId: string) => {
  const reviews = await Review.find({ product: productId });
  const rating_count = reviews.length;
  const rating_avg = rating_count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / rating_count
    : 0;

  await Product.findByIdAndUpdate(productId, {
    rating_avg: Math.round(rating_avg * 10) / 10,
    rating_count,
  });
};


export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "full_name")
    .sort({ createdAt: -1 });

  sendResponse(res, { message: "Reviews fetched", data: reviews, statusCode: 200 });
});

/**
 * POST /api/v1/reviews/product/:productId
 * Purpose: submit a review for a product. One review per user per product.
 * Auth: required. Body: { rating: 1-5, comment: string }
 * Side effect: recalculates the product's rating_avg/rating_count.
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!rating) throw new ApiError("rating is required", 400);
  if (!comment) throw new ApiError("comment is required", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const existing = await Review.findOne({ product: productId, user: req.user?._id });
  if (existing) throw new ApiError("You have already reviewed this product", 409);

  const review = await Review.create({
    product: productId,
    user: req.user?._id,
    rating,
    comment,
  });
  await review.populate("user", "full_name");

  await recalculateProductRating(productId);

  sendResponse(res, { message: "Review submitted", data: review, statusCode: 201 });
});


export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError("Review not found", 404);

  if (String(review.user) !== String(req.user?._id)) {
    throw new ApiError("Forbidden. You can only delete your own review.", 403);
  }

  const productId = String(review.product);
  await review.deleteOne();
  await recalculateProductRating(productId);

  sendResponse(res, { message: "Review deleted", data: null, statusCode: 200 });
});