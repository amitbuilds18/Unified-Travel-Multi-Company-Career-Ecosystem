import Destination from "../models/Destination.js";
import Review from "../models/Review.js";

// GET ALL DESTINATIONS WITH FILTERS AND SORTING
export const getDestinations = async (req, res) => {
  try {
    const {
      search,
      category,
      country,
      maxPrice,
      minPrice,
      sortBy = "featured",
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (country && country !== "All") {
      query.country = { $regex: country, $options: "i" };
    }

    if (maxPrice || minPrice) {
      query.pricePerPerson = {};
      if (minPrice) query.pricePerPerson.$gte = Number(minPrice);
      if (maxPrice) query.pricePerPerson.$lte = Number(maxPrice);
    }

    // Sort options
    let sort = {};
    if (sortBy === "price_asc") sort.pricePerPerson = 1;
    else if (sortBy === "price_desc") sort.pricePerPerson = -1;
    else if (sortBy === "rating_desc") sort["ratings.avg"] = -1;
    else if (sortBy === "duration") sort.durationDays = 1;
    else sort.createdAt = -1;

    const destinations = await Destination.find(query)
      .populate("company", "name logo verified")
      .sort(sort);

    res.json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    console.error("getDestinations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load destinations",
      error: error.message,
    });
  }
};

// GET SINGLE DESTINATION BY SLUG OR ID
export const getDestination = async (req, res) => {
  try {
    const { slug } = req.params;

    let dest = null;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      dest = await Destination.findById(slug).populate("company", "name logo verified website email");
    }

    if (!dest) {
      dest = await Destination.findOne({ slug }).populate("company", "name logo verified website email");
    }

    if (!dest) {
      return res.status(404).json({
        success: false,
        message: "Destination tour package not found",
      });
    }

    // Also fetch reviews for this destination if available
    const reviews = await Review.find({ destinationId: dest._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      destination: {
        ...dest.toObject(),
        reviews,
      },
    });
  } catch (error) {
    console.error("getDestination error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching destination",
      error: error.message,
    });
  }
};

// CREATE NEW DESTINATION (Admin / Travel Partner)
export const addDestination = async (req, res) => {
  try {
    const {
      title,
      country,
      city,
      durationDays,
      pricePerPerson,
      description,
      images,
      highlights,
      itinerary,
      hotels,
      category,
      badge,
      companyId,
    } = req.body;

    if (!title || !country || !pricePerPerson || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, country, price, and description are required",
      });
    }

    const destination = await Destination.create({
      title,
      country,
      city: city || "",
      durationDays: Number(durationDays) || 5,
      durationNights: (Number(durationDays) || 5) - 1,
      pricePerPerson: Number(pricePerPerson),
      price: Number(pricePerPerson),
      description,
      images: Array.isArray(images) ? images : [images].filter(Boolean),
      highlights: Array.isArray(highlights) ? highlights : [],
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      hotels: Array.isArray(hotels) ? hotels : [],
      category: category || "Popular",
      badge: badge || "Best Seller",
      company: companyId || null,
    });

    res.status(201).json({
      success: true,
      message: "Destination tour created successfully",
      destination,
    });
  } catch (error) {
    console.error("addDestination error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create destination",
      error: error.message,
    });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await Destination.findByIdAndDelete(id);
    res.json({ success: true, message: "Destination tour package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete destination", error: error.message });
  }
};
