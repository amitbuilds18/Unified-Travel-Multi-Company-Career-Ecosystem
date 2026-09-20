import express from "express";
import Review from "../models/Review.js";
import Destination from "../models/Destination.js"; // 🔥 Missing import added

const router = express.Router();

// GET reviews by destination slug
router.get("/destinations/:slug/reviews", async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });
    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    const reviews = await Review.find({ destination: destination._id })
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
router.post("/destinations/:slug/reviews", async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });
    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    const review = await Review.create({
      user: { name: req.body.name || "Anonymous" },
      rating: req.body.rating,
      comment: req.body.comment,
      destination: destination._id,
    });

    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; // 🔥 Default export added
