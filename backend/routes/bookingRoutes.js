// import express from "express";
// import { addBooking, getMyBookings } from "../controllers/bookingController.js";
// import { auth } from "../middleware/auth.js";

// const router = express.Router();

// router.post("/", auth, addBooking);
// router.get("/mine", auth, getMyBookings);

// export default router;

import express from "express";
import {
  addBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// User booking routes (requires login)
router.post("/", protect, addBooking);
router.get("/mine", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/all", getAllBookings);
router.get("/", getAllBookings);

export default router;
