import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, default: "Anonymous" },
    },
    rating: { type: Number, required: true },
    comment: String,
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
