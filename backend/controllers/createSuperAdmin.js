// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// export const createSuperAdmin = async (req, res) => {
//   try {
//     const exists = await User.findOne({ email: "admin@example.com" });
//     if (exists) return res.json({ message: "Superadmin already exists" });

//     const hashed = await bcrypt.hash("admin123", 10);

//     const admin = await User.create({
//       name: "Main Super Admin",
//       email: "admin@example.com",
//       password: hashed,
//       role: "admin"
//     });

//     res.json({ message: "Superadmin created", admin });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating superadmin", error });
//   }
// };


import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createSuperAdmin = async (req, res) => {
  try {
    const exists = await User.findOne({ email: "admin@example.com" });
    if (exists) return res.json({ message: "Superadmin already exists" });

    const hashed = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Main Super Admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin"
    });

    res.json({ message: "Superadmin created", admin });
  } catch (error) {
    res.status(500).json({ message: "Error creating superadmin", error });
  }
};


export const getSuperAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select("-password");

    if (!admin) {
      return res.json({ message: "No Super Admin Found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin", error });
  }
};
