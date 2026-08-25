import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../types/enum.types";

const router = Router();

router.use(authenticate());

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", authenticate([Role.ADMIN]), updateOrderStatus);

export default router;
