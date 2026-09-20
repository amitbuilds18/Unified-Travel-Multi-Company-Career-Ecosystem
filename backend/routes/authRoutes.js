import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);
router.post("/admin/login", adminLogin); // Alias to prevent client route mismatch
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
