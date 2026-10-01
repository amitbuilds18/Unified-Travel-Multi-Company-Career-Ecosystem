import Destination from "../models/Destination.js";

export const getReviewsByDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    res.json(destination.reviews || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ success: false, message: "Destination not found" });

    const { rating, comment, user } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Review comment is required." });
    }

    const reviewObj = {
      user: {
        name: typeof user === "object" ? user.name || "Verified Traveler" : user || "Verified Traveler",
        email: typeof user === "object" ? user.email || "" : "",
      },
      rating: Number(rating) || 5,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    if (!destination.reviews) {
      destination.reviews = [];
    }

    destination.reviews.unshift(reviewObj);

    // Recalculate average rating & count
    const totalReviews = destination.reviews.length;
    const avg =
      destination.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews;

    destination.ratings = {
      avg: Number(avg.toFixed(1)),
      count: totalReviews,
    };

    await destination.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: reviewObj,
      ratings: destination.ratings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
