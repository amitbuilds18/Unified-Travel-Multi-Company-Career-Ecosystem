import mongoose from "mongoose";
import slugify from "slugify";

const destinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },

    // Location details
    country: { type: String, required: true },
    city: { type: String },
    propertyName: { type: String },

    // Category / Tagging
    category: {
      type: String,
      default: "Popular",
    },
    badge: {
      type: String,
      default: "Best Seller",
    },

    // Trip details
    durationDays: { type: Number, default: 5 },
    durationNights: { type: Number, default: 4 },
    pricePerPerson: { type: Number, required: true },
    price: { type: Number },
    discountPercentage: { type: Number, default: 15 },
    description: { type: String, required: true },

    // Images
    images: [{ type: String }],

    // Highlights & Inclusions
    highlights: [{ type: String }],
    inclusions: [{ type: String }],

    // Itinerary array of objects
    itinerary: [
      {
        day: Number,
        title: String,
        desc: String,
        activityIcon: String,
      },
    ],

    // Reviews & Ratings
    ratings: {
      avg: { type: Number, default: 4.8 },
      count: { type: Number, default: 24 },
    },
    reviews: [
      {
        user: {
          name: { type: String, default: "Verified Traveler" },
          email: { type: String },
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Hotels list
    hotels: [
      {
        name: String,
        city: String,
        price: Number,
        image: String,
        rating: Number,
        amenities: [String],
      },
    ],

    // Partner Company organizing this tour
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  { timestamps: true }
);

// Auto slug
destinationSchema.pre("save", async function (next) {
  if (!this.slug) {
    let slug = slugify(this.title, { lower: true, strict: true }) || "tour-package";
    let exists = await mongoose.models.Destination.findOne({ slug });

    let counter = 1;
    while (exists) {
      slug = `${slug}-${counter++}`;
      exists = await mongoose.models.Destination.findOne({ slug });
    }

    this.slug = slug;
  }
  next();
});

export default mongoose.model("Destination", destinationSchema);
