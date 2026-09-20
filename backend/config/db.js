import mongoose from "mongoose";

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";
  const localFallbackUri = "mongodb://127.0.0.1:27017/travelDB";

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(primaryUri, {
      family: 4,
      serverSelectionTimeoutMS: 4000,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.warn("⚠️ Primary MongoDB connection failed:", error.message);
    if (primaryUri !== localFallbackUri) {
      try {
        console.log("Attempting local MongoDB fallback:", localFallbackUri);
        await mongoose.connect(localFallbackUri, {
          family: 4,
          serverSelectionTimeoutMS: 4000,
        });
        console.log("✅ Connected to Local MongoDB Fallback Successfully");
      } catch (fallbackError) {
        console.error("❌ Local MongoDB Fallback also failed:", fallbackError.message);
      }
    }
  }
};

export default connectDB;
