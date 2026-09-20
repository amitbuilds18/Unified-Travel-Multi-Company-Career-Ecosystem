import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// Get all companies with search, filter, and open jobs count
export const getAllCompanies = async (req, res) => {
  try {
    const { search, industry, location } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (industry && industry !== "All") {
      query.industry = { $regex: new RegExp(`^${industry}$`, "i") };
    }

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });

    // Attach active job count to each company
    const companiesWithJobCount = await Promise.all(
      companies.map(async (company) => {
        const jobsCount = await Job.countDocuments({
          company: company._id,
          status: "Open",
        });
        return {
          ...company.toObject(),
          jobsCount,
        };
      })
    );

    res.json({
      success: true,
      count: companiesWithJobCount.length,
      companies: companiesWithJobCount,
    });
  } catch (error) {
    console.error("getAllCompanies error:", error);
    res.status(500).json({ message: "Failed to retrieve companies", error: error.message });
  }
};

// Get single company by ID or Slug, along with active jobs
export const getCompanyByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let company = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      company = await Company.findById(idOrSlug).populate("owner", "name email");
    }

    if (!company) {
      company = await Company.findOne({ slug: idOrSlug }).populate("owner", "name email");
    }

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await Job.find({ company: company._id, status: "Open" }).sort({ createdAt: -1 });

    res.json({
      success: true,
      company,
      jobs,
    });
  } catch (error) {
    console.error("getCompanyByIdOrSlug error:", error);
    res.status(500).json({ message: "Failed to load company profile", error: error.message });
  }
};

// Get current recruiter's company
export const getMyCompany = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let company = null;
    if (user.company) {
      company = await Company.findById(user.company);
    } else {
      company = await Company.findOne({ owner: req.userId });
    }

    if (!company) {
      return res.json({ success: true, company: null });
    }

    const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      company,
      jobs,
    });
  } catch (error) {
    console.error("getMyCompany error:", error);
    res.status(500).json({ message: "Failed to fetch company profile", error: error.message });
  }
};

// Create a new Company profile
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      tagline,
      description,
      logo,
      bannerImage,
      website,
      email,
      phone,
      location,
      industry,
      employeeCount,
      foundedYear,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Company name and description are required" });
    }

    const existingCompany = await Company.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }],
    });

    if (existingCompany) {
      return res.status(400).json({ message: "A company with this name is already registered" });
    }

    const company = await Company.create({
      name,
      tagline,
      description,
      logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
      bannerImage,
      website,
      email: email || req.user.email,
      phone,
      location: location || "Remote",
      industry: industry || "Technology",
      employeeCount: employeeCount || "11-50 employees",
      foundedYear: foundedYear || new Date().getFullYear(),
      owner: req.userId,
    });

    // Link to user if recruiter
    await User.findByIdAndUpdate(req.userId, {
      company: company._id,
      role: req.user.role === "user" ? "company_admin" : req.user.role,
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error("createCompany error:", error);
    res.status(500).json({ message: "Failed to create company", error: error.message });
  }
};

// Update Company profile
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Only owner or admin can edit
    const isOwner = company.owner.toString() === req.userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to update this company" });
    }

    const allowedFields = [
      "name",
      "tagline",
      "description",
      "logo",
      "bannerImage",
      "website",
      "email",
      "phone",
      "location",
      "industry",
      "employeeCount",
      "foundedYear",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();

    res.json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("updateCompany error:", error);
    res.status(500).json({ message: "Failed to update company", error: error.message });
  }
};

// Toggle Verification (Admin / SuperAdmin only)
export const toggleCompanyVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.verified = !company.verified;
    await company.save();

    res.json({
      success: true,
      message: `Company ${company.verified ? "verified" : "unverified"} successfully`,
      verified: company.verified,
    });
  } catch (error) {
    console.error("toggleCompanyVerification error:", error);
    res.status(500).json({ message: "Action failed", error: error.message });
  }
};
