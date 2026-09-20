import express from "express";
import { createSuperAdmin, getSuperAdmin } from "../controllers/createSuperAdmin.js";

const router = express.Router();

router.get("/create", createSuperAdmin);
router.get("/", getSuperAdmin);

export default router;
