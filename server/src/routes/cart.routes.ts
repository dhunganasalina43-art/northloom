import { Router } from "express";
import {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate());

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:itemId", updateItemQuantity);
router.delete("/items/:itemId", removeItem);
router.delete("/", clearCart);

export default router;
