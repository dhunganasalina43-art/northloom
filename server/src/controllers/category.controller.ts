import { Request, Response } from "express";
import Category from "../models/category.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils";
import { generateUniqueSlug } from "../utils/slugify.utils";

/**
 * GET /api/v1/categories
 * Purpose: list all categories (used for the storefront filter sidebar/nav).
 * Public. Response: 200 with array of categories.
 */
export const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });
  sendResponse(res, { message: "Categories fetched", data: categories, statusCode: 200 });
});

/**
 * GET /api/v1/categories/:id
 * Purpose: fetch a single category by id.
 */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError("Category not found", 404);
  sendResponse(res, { message: "Category fetched", data: category, statusCode: 200 });
});

/**
 * POST /api/v1/categories  (admin only)
 * Purpose: create a new category, optionally with a cover image.
 * Body: multipart/form-data { name, description?, image? }
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) throw new ApiError("name is required", 400);

  const slug = await generateUniqueSlug(Category, name);

  let image;
  if (req.file) {
    image = await uploadToCloudinary(req.file.path, "northloom/categories");
  }

  const category = await Category.create({ name, slug, description, image });

  sendResponse(res, { message: "Category created", data: category, statusCode: 201 });
});

/**
 * PUT /api/v1/categories/:id  (admin only)
 * Purpose: update a category's name/description/image.
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError("Category not found", 404);

  const { name, description } = req.body;
  if (name && name !== category.name) {
    category.name = name;
    category.slug = await generateUniqueSlug(Category, name);
  }
  if (description !== undefined) category.description = description;

  if (req.file) {
    if (category.image?.public_id) await deleteFromCloudinary(category.image.public_id);
    category.image = await uploadToCloudinary(req.file.path, "northloom/categories");
  }

  await category.save();

  sendResponse(res, { message: "Category updated", data: category, statusCode: 200 });
});

/**
 * DELETE /api/v1/categories/:id  (admin only)
 * Purpose: remove a category (and its Cloudinary image, if any).
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError("Category not found", 404);

  if (category.image?.public_id) await deleteFromCloudinary(category.image.public_id);
  await category.deleteOne();

  sendResponse(res, { message: "Category deleted", data: null, statusCode: 200 });
});
