// import express from "express";
// import {
//   getDestination,
//   getDestinations,
// } from "../controllers/destinationController.js";

// const router = express.Router();

// // GET all destinations
// router.get("/", getDestinations);

// // GET single destination by slug
// router.get("/:slug", getDestination);

// export default router;



import express from "express";
import {
  getDestination,
  getDestinations,
  addDestination,
  deleteDestination,
} from "../controllers/destinationController.js";
import { getReviewsByDestination, addReview } from "../controllers/reviewController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// ⭐ Add review routes before slug route ⭐
router.get("/:id/reviews", getReviewsByDestination);
router.post("/:id/reviews", addReview);

// GET all destinations
router.get("/", getDestinations);

// CREATE destination
router.post("/", addDestination);
router.post("/add", addDestination);

// DELETE destination
router.delete("/:id", deleteDestination);

// GET single destination by slug
router.get("/:slug", getDestination);

export default router;
