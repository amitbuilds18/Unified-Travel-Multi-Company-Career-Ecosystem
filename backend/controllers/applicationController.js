import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Core Feature: Batch Apply to Multiple Companies / Jobs
export const batchApply = async (req, res) => {
  try {
    const {
      applications = [], // Array of { companyId, jobId }
      applicantName,
      applicantEmail,
      applicantPhone,
      resumeUrl,
      coverLetter,
      portfolioUrl,
      skills,
      experienceYears,
    } = req.body;

    if (!applications || applications.length === 0) {
      return res.status(400).json({ message: "No companies or jobs selected for application" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const batchApplicationId = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const createdApplications = [];
    const skippedApplications = [];

    const resolvedSkills = skills
      ? Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean)
      : user.skills || [];

    for (const item of applications) {
      const { companyId, jobId } = item;

      if (!companyId) continue;

      // Check if already applied to this exact job
      if (jobId) {
        const existing = await Application.findOne({
          applicant: req.userId,
          job: jobId,
        });

        if (existing) {
          skippedApplications.push({
            jobId,
            companyId,
            reason: "Already applied to this opening",
          });
          continue;
        }
      }

      // Create application
      const newApp = await Application.create({
        applicant: req.userId,
        company: companyId,
        job: jobId || null,
        applicantName: applicantName || user.name,
        applicantEmail: applicantEmail || user.email,
        applicantPhone: applicantPhone || user.phone || "",
        resumeUrl: resumeUrl || user.resumeUrl || "",
        coverLetter: coverLetter || "",
        portfolioUrl: portfolioUrl || user.portfolioUrl || "",
        skills: resolvedSkills,
        experienceYears: Number(experienceYears) || user.experienceYears || 0,
        status: "Pending",
        batchApplicationId,
      });

      createdApplications.push(newApp);
    }

    // Also update user's profile with latest details if provided
    if (resumeUrl && !user.resumeUrl) user.resumeUrl = resumeUrl;
    if (applicantPhone && !user.phone) user.phone = applicantPhone;
    if (portfolioUrl && !user.portfolioUrl) user.portfolioUrl = portfolioUrl;
    if (resolvedSkills.length > 0 && (!user.skills || user.skills.length === 0)) {
      user.skills = resolvedSkills;
    }
    await user.save();

    if (createdApplications.length > 0) {
      try {
        await Notification.create({
          userId: req.userId,
          title: "Batch Application Submitted 🚀",
          message: `Your profile was submitted to ${createdApplications.length} company openings. (Ref: ${batchApplicationId})`,
          type: "JOB_APPLY",
          link: "/my-applications",
        });
      } catch (notifErr) {
        console.warn("Notification error:", notifErr);
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully submitted applications to ${createdApplications.length} companies/openings`,
      appliedCount: createdApplications.length,
      skippedCount: skippedApplications.length,
      batchApplicationId,
      applications: createdApplications,
      skipped: skippedApplications,
    });
  } catch (error) {
    console.error("batchApply error:", error);
    res.status(500).json({ message: "Failed to submit batch application", error: error.message });
  }
};

// Single Application
export const singleApply = async (req, res) => {
  try {
    const {
      companyId,
      jobId,
      applicantName,
      applicantEmail,
      applicantPhone,
      resumeUrl,
      coverLetter,
      portfolioUrl,
      skills,
      experienceYears,
    } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check duplicate
    if (jobId) {
      const existing = await Application.findOne({
        applicant: req.userId,
        job: jobId,
      });
      if (existing) {
        return res.status(400).json({ message: "You have already applied to this opening" });
      }
    }

    const resolvedSkills = skills
      ? Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean)
      : user.skills || [];

    const application = await Application.create({
      applicant: req.userId,
      company: companyId,
      job: jobId || null,
      applicantName: applicantName || user.name,
      applicantEmail: applicantEmail || user.email,
      applicantPhone: applicantPhone || user.phone || "",
      resumeUrl: resumeUrl || user.resumeUrl || "",
      coverLetter: coverLetter || "",
      portfolioUrl: portfolioUrl || user.portfolioUrl || "",
      skills: resolvedSkills,
      experienceYears: Number(experienceYears) || user.experienceYears || 0,
      status: "Pending",
    });

    try {
      const company = await Company.findById(companyId);
      await Notification.create({
        userId: req.userId,
        title: "Application Submitted 📄",
        message: `Your application to ${company?.name || "the employer"} was successfully received.`,
        type: "JOB_APPLY",
        link: "/my-applications",
      });
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("singleApply error:", error);
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
};

// Get all applications submitted by the logged-in candidate
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate("company", "name slug logo verified location industry website")
      .populate("job", "title location jobType category salaryMin salaryMax salaryCurrency")
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      total: applications.length,
      pending: applications.filter((a) => a.status === "Pending").length,
      underReview: applications.filter((a) => a.status === "Under Review").length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      interviewing: applications.filter((a) => a.status === "Interviewing").length,
      accepted: applications.filter((a) => a.status === "Accepted").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    };

    res.json({
      success: true,
      stats,
      applications,
    });
  } catch (error) {
    console.error("getMyApplications error:", error);
    res.status(500).json({ message: "Failed to load applications", error: error.message });
  }
};

// Recruiter: Get all applications received for their company
export const getCompanyApplications = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status, jobId } = req.query;

    const user = await User.findById(req.userId);
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Verify user owns company or is admin
    const isOwner = company.owner.toString() === req.userId.toString();
    const isAdmin = user.role === "admin" || user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    let query = { company: companyId };
    if (status && status !== "All") {
      query.status = status;
    }
    if (jobId && jobId !== "All") {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate("job", "title location jobType")
      .populate("applicant", "name email phone headline resumeUrl")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("getCompanyApplications error:", error);
    res.status(500).json({ message: "Failed to retrieve applications", error: error.message });
  }
};

// Recruiter: Update application status (Shortlist, Interview, Accept, Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes } = req.body;

    const application = await Application.findById(id).populate("company");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const company = application.company;
    const isOwner = company && company.owner.toString() === req.userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;

    await application.save();

    // Trigger notification to candidate
    if (application.applicant) {
      try {
        await Notification.create({
          userId: application.applicant,
          title: `Application Status: ${status} 🎯`,
          message: `${company?.name || "The recruiter"} updated your application status to "${status}".`,
          type: "APPLICATION_STATUS",
          link: "/my-applications",
        });
      } catch (e) {
        console.warn("Notification create error:", e);
      }
    }

    res.json({
      success: true,
      message: `Candidate status updated to "${status}"`,
      application,
    });
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};
