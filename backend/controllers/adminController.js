import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * Create an admin user (only superadmin can call)
 * Body: { name, email, password }
 */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed, role: "admin" });

    const safeAdmin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    res.status(201).json({ message: "Admin created", admin: safeAdmin });
  } catch (error) {
    console.error("createAdmin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all admins (superadmin only)
 */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json({ admins });
  } catch (error) {
    console.error("getAllAdmins error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Remove admin by id (superadmin only)
 */
export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.role !== "admin") return res.status(400).json({ message: "User is not admin" });

    await User.findByIdAndDelete(id);
    res.json({ message: "Admin removed" });
  } catch (error) {
    console.error("removeAdmin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
