import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { Role } from "../types/enum.types";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticate([Role.ADMIN]), upload.single("image"), createCategory);
router.put("/:id", authenticate([Role.ADMIN]), upload.single("image"), updateCategory);
router.delete("/:id", authenticate([Role.ADMIN]), deleteCategory);

export default router;
