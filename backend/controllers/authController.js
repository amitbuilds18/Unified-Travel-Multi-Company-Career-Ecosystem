import User from "../models/User.js";
import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register User or Company Admin / Recruiter
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      phone,
      headline,
      companyName,
      companyIndustry,
      companyLocation,
      companyDescription,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole =
      role === "company_admin" || role === "admin" || role === "superadmin"
        ? role
        : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone: phone || "",
      headline: headline || "",
    });

    // If registering as Company Admin and company details provided, create the Company
    let companyData = null;
    if (userRole === "company_admin" && companyName) {
      const company = await Company.create({
        name: companyName,
        industry: companyIndustry || "Technology",
        location: companyLocation || "Remote",
        description:
          companyDescription ||
          `${companyName} is actively hiring talented professionals.`,
        email: email,
        phone: phone || "",
        owner: user._id,
      });

      user.company = company._id;
      await user.save();
      companyData = company;
    }

    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: companyData,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).populate("company");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        experienceYears: user.experienceYears,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      email,
      role: { $in: ["admin", "superadmin"] },
    });

    if (!admin) {
      return res.status(401).json({ message: "Admin account not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin);

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("company");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      headline,
      bio,
      skills,
      resumeUrl,
      experienceYears,
      location,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (experienceYears !== undefined) user.experienceYears = Number(experienceYears) || 0;
    if (location !== undefined) user.location = location;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        experienceYears: user.experienceYears,
        location: user.location,
        portfolioUrl: user.portfolioUrl,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
