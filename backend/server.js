import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";

// CONFIG
dotenv.config();
connectDB();

// APP INIT
const app = express();

// MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// STATIC FILES
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MULTI-COMPANY PORTAL ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// DESTINATIONS & BOOKINGS (ORIGINAL MODULES)
app.use("/api/destinations", destinationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

// AMADEUS / LIVE TRAVEL API (FLIGHTS, HOTELS, SIGHTSEEING)
app.use("/api/travel", travelRoutes);

// ADMIN & SUPERADMIN
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superAdminRoutes);

// REVIEWS
app.use("/api", reviewRoutes);

// ROOT
app.get("/api", (req, res) => {
  res.json({ message: "Multi-Company & Travel Application Platform API is running 🚀" });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
