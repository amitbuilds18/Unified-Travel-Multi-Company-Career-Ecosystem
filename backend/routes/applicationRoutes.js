import express from "express";
import {
  batchApply,
  singleApply,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/batch-apply", protect, batchApply);
router.post("/single", protect, singleApply);
router.get("/my-applications", protect, getMyApplications);
router.get("/company/:companyId", protect, getCompanyApplications);
router.put("/:id/status", protect, updateApplicationStatus);

export default router;
