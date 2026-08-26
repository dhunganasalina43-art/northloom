import { Router } from "express";
import { getProductReviews, createReview, deleteReview } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/product/:productId", getProductReviews);
router.post("/product/:productId", authenticate(), createReview);
router.delete("/:id", authenticate(), deleteReview);

export default router;