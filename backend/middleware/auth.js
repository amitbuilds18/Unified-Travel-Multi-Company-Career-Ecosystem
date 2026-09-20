import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Middleware to verify token and attach user to req.user
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("protect middleware error:", error);
    return res.status(401).json({ message: "Token invalid or expired", error: error.message });
  }
};

// Optional auth: attaches user if token present, but doesn't block if not
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
    next();
  } catch {
    // Continue unauthenticated
    next();
  }
};

// Recruiter / Company Admin or System Admin access
export const recruiterOrAdminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (
    req.user.role === "company_admin" ||
    req.user.role === "admin" ||
    req.user.role === "superadmin"
  ) {
    return next();
  }
  return res.status(403).json({ message: "Company Recruiter or Admin access required" });
};

// Admin access (admin OR superadmin)
export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Admins only" });
};

// Superadmin access only
export const superAdminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Superadmin only" });
};
