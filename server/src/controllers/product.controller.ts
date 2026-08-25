import { Request, Response } from "express";
import Product from "../models/product.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils";
import { generateUniqueSlug } from "../utils/slugify.utils";
import { getPagination, buildMeta } from "../utils/pagination.utils";

/**
 * GET /api/v1/products
 * Purpose: main storefront listing endpoint - supports search, category
 * filter, price range, sort, and pagination all at once.
 * Query: q?, category?, minPrice?, maxPrice?, sort? (price_asc|price_desc|newest|rating),
 *        page?, limit?
 * Public. Response: 200 with { products } + pagination meta.
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const { q, category, minPrice, maxPrice, sort } = req.query;

  const filter: Record<string, any> = {};
  if (q) filter.$text = { $search: String(q) };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap: Record<string, any> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating_avg: -1 },
  };
  const sortBy = sortMap[sort as string] || { createdAt: -1 };

  const { currentPage, pageSize, skip } = getPagination(
    req.query.page as string,
    req.query.limit as string,
  );

  const [products, totalCount] = await Promise.all([
    Product.find(filter).populate("category", "name slug").sort(sortBy).skip(skip).limit(pageSize),
    Product.countDocuments(filter),
  ]);

  sendResponse(res, {
    message: "Products fetched",
    data: products,
    statusCode: 200,
    meta: buildMeta(totalCount, currentPage, pageSize),
  });
});

/** GET /api/v1/products/featured - products flagged is_featured, for the homepage. */
export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ is_featured: true }).limit(8).populate("category", "name slug");
  sendResponse(res, { message: "Featured products fetched", data: products, statusCode: 200 });
});

/** GET /api/v1/products/:id - single product detail page. */
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) throw new ApiError("Product not found", 404);
  sendResponse(res, { message: "Product fetched", data: product, statusCode: 200 });
});

/**
 * POST /api/v1/products  (admin only)
 * Purpose: create a product with up to 6 images.
 * Body: multipart/form-data { name, description, price, stock, category, tags?, is_featured?, images[] }
 * Validation: name/description/price/stock/category required (see model);
 *             description must be >= 20 chars.
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, stock, category, tags, is_featured, compare_at_price } = req.body;

  if (!name) throw new ApiError("name is required", 400);
  if (!category) throw new ApiError("category is required", 400);

  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) throw new ApiError("at least one product image is required", 400);

  const slug = await generateUniqueSlug(Product, name);

  const images = await Promise.all(
    files.map((file) => uploadToCloudinary(file.path, "northloom/products")),
  );

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    compare_at_price,
    stock,
    category,
    images,
    tags: tags ? String(tags).split(",").map((t) => t.trim()) : [],
    is_featured: is_featured === "true" || is_featured === true,
  });

  sendResponse(res, { message: "Product created", data: product, statusCode: 201 });
});

/**
 * PUT /api/v1/products/:id  (admin only)
 * Purpose: update product fields and optionally append new images.
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError("Product not found", 404);

  const { name, description, price, stock, category, tags, is_featured, compare_at_price } = req.body;

  if (name && name !== product.name) {
    product.name = name;
    product.slug = await generateUniqueSlug(Product, name);
  }
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (compare_at_price !== undefined) product.compare_at_price = compare_at_price;
  if (stock !== undefined) product.stock = stock;
  if (category !== undefined) product.category = category;
  if (tags !== undefined) product.tags = String(tags).split(",").map((t) => t.trim());
  if (is_featured !== undefined) product.is_featured = is_featured === "true" || is_featured === true;

  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length > 0) {
    const newImages = await Promise.all(
      files.map((file) => uploadToCloudinary(file.path, "northloom/products")),
    );
    product.images.push(...newImages);
  }

  await product.save();

  sendResponse(res, { message: "Product updated", data: product, statusCode: 200 });
});

/**
 * DELETE /api/v1/products/:id  (admin only)
 * Purpose: remove a product and its Cloudinary images.
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError("Product not found", 404);

  await Promise.all(product.images.map((img) => deleteFromCloudinary(img.public_id)));
  await product.deleteOne();

  sendResponse(res, { message: "Product deleted", data: null, statusCode: 200 });
});
