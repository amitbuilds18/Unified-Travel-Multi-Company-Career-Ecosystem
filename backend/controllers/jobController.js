import Job from "../models/Job.js";
import Company from "../models/Company.js";

// Get all jobs with filters and search
export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      category,
      location,
      experienceLevel,
      companyId,
      status = "Open",
    } = req.query;

    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (companyId) {
      query.company = companyId;
    }

    if (jobType && jobType !== "All") {
      query.jobType = jobType;
    }

    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (experienceLevel && experienceLevel !== "All") {
      query.experienceLevel = experienceLevel;
    }

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("company", "name slug logo verified location industry")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Get single job details
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate(
      "company",
      "name slug logo verified website email phone location industry description employeeCount"
    );

    if (!job) {
      return res.status(404).json({ message: "Job opening not found" });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ message: "Failed to load job details", error: error.message });
  }
};

// Create a new job post
export const createJob = async (req, res) => {
  try {
    const {
      title,
      companyId,
      location,
      jobType,
      experienceLevel,
      category,
      salaryMin,
      salaryMax,
      salaryCurrency,
      description,
      responsibilities,
      requirements,
      skillsRequired,
      openings,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    // Resolve company
    let targetCompanyId = companyId;
    if (!targetCompanyId) {
      const userCompany = await Company.findOne({ owner: req.userId });
      if (userCompany) {
        targetCompanyId = userCompany._id;
      } else if (req.user.company) {
        targetCompanyId = req.user.company;
      }
    }

    if (!targetCompanyId) {
      return res.status(400).json({
        message: "Please register your company profile first before posting jobs",
      });
    }

    const parseList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const parseCommaList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const job = await Job.create({
      title,
      company: targetCompanyId,
      location,
      jobType: jobType || "Full-time",
      experienceLevel: experienceLevel || "Entry Level",
      category: category || "Technology",
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      salaryCurrency: salaryCurrency || "INR",
      description,
      responsibilities: parseList(responsibilities),
      requirements: parseList(requirements),
      skillsRequired: parseCommaList(skillsRequired),
      openings: Number(openings) || 1,
      status: "Open",
      postedBy: req.userId,
    });

    const populatedJob = await Job.findById(job._id).populate("company", "name logo");

    res.status(201).json({
      success: true,
      message: "Job opening published successfully",
      job: populatedJob,
    });
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ message: "Failed to create job", error: error.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check permissions
    const company = await Company.findById(job.company);
    const isOwner =
      job.postedBy?.toString() === req.userId.toString() ||
      company?.owner?.toString() === req.userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatable = [
      "title",
      "location",
      "jobType",
      "experienceLevel",
      "category",
      "salaryMin",
      "salaryMax",
      "salaryCurrency",
      "description",
      "openings",
      "status",
    ];

    updatable.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });

    if (req.body.skillsRequired) {
      job.skillsRequired = Array.isArray(req.body.skillsRequired)
        ? req.body.skillsRequired
        : req.body.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean);
    }

    await job.save();

    res.json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("updateJob error:", error);
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const company = await Company.findById(job.company);
    const isOwner =
      job.postedBy?.toString() === req.userId.toString() ||
      company?.owner?.toString() === req.userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Job opening deleted successfully",
    });
  } catch (error) {
    console.error("deleteJob error:", error);
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};
