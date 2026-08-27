
import express from "express";

import authRoutes from "./auth.routes";

import userRoutes from "./user.routes";

import categoryRoutes from "./category.routes";

import productRoutes from "./product.routes";

import cartRoutes from "./cart.routes";

import orderRoutes from "./order.routes";

import wishlistRoutes from "./wishlist.routes";

import reviewRoutes from "./review.routes";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/categories", categoryRoutes);

router.use("/products", productRoutes);

router.use("/cart", cartRoutes);

router.use("/orders", orderRoutes);

router.use("/wishlist", wishlistRoutes);

router.use("/reviews", reviewRoutes);

export default router;

