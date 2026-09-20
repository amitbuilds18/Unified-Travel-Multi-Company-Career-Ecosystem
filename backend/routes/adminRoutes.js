import express from "express";
import { createAdmin, getAllAdmins, removeAdmin } from "../controllers/adminController.js";
import { adminLogin } from "../controllers/authController.js";
import { protect, superAdminOnly } from "../middleware/auth.js";

const router = express.Router();

// Allow admin login directly at /api/admin/login
router.post("/login", adminLogin);

// Superadmin management routes
router.post("/create-admin", protect, superAdminOnly, createAdmin);
router.get("/all-admins", protect, superAdminOnly, getAllAdmins);
router.delete("/remove-admin/:id", protect, superAdminOnly, removeAdmin);

export default router;
