import { Router } from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { Role } from "../types/enum.types";

const router = Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.post("/", authenticate([Role.ADMIN]), upload.array("images", 6), createProduct);
router.put("/:id", authenticate([Role.ADMIN]), upload.array("images", 6), updateProduct);
router.delete("/:id", authenticate([Role.ADMIN]), deleteProduct);

export default router;
