import express from "express";
import {
  createOrder,
  verifyPayment,
  createInstantBooking,
  getRazorpayKey,
} from "../controllers/paymentController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-key", getRazorpayKey);
router.post("/create-order", createOrder);
router.post("/verify-payment", optionalAuth, verifyPayment);
router.post("/instant-booking", optionalAuth, createInstantBooking);

export default router;
