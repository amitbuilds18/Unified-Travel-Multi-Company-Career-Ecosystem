import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";

// GET PUBLIC KEY FOR FRONTEND
export const getRazorpayKey = (req, res) => {
  res.json({ keyId: process.env.RZP_KEY_ID || "" });
};

// CREATE REAL ORDER
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RZP_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed on Razorpay servers",
      error: error.message,
    });
  }
};

// VERIFY REAL PAYMENT SIGNATURE
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature, payment verification failed" });
    }

    const booking = await Booking.create({
      ...bookingData,
      userId: req.userId || null,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "CONFIRMED",
    });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

// DEMO / INSTANT BOOKING
export const createInstantBooking = async (req, res) => {
  try {
    const { bookingData } = req.body;

    const booking = await Booking.create({
      ...bookingData,
      userId: req.userId || null,
      paymentId: "PAY_DEMO_" + Date.now(),
      orderId: "ORD_" + Date.now(),
      status: "CONFIRMED",
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("createInstantBooking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking creation failed",
      error: error.message,
    });
  }
};
