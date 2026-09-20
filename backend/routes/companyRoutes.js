import express from "express";
import {
  getAllCompanies,
  getCompanyByIdOrSlug,
  getMyCompany,
  createCompany,
  updateCompany,
  toggleCompanyVerification,
} from "../controllers/companyController.js";
import {
  protect,
  optionalAuth,
  recruiterOrAdminOnly,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/my-company", protect, getMyCompany);
router.get("/:idOrSlug", optionalAuth, getCompanyByIdOrSlug);
router.post("/", protect, createCompany);
router.put("/:id", protect, updateCompany);
router.patch("/:id/verify", protect, adminOnly, toggleCompanyVerification);

export default router;
