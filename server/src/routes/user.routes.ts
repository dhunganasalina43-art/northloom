import { Router } from "express";
import {
  updateProfile,
  updateAvatar,
  addAddress,
  getAllUsers,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { Role } from "../types/enum.types";

const router = Router();

router.put("/profile", authenticate(), updateProfile);
router.put("/profile/avatar", authenticate(), upload.single("avatar"), updateAvatar);
router.post("/addresses", authenticate(), addAddress);
router.get("/", authenticate([Role.ADMIN]), getAllUsers);

export default router;
