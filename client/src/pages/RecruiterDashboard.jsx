import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { companiesAPI, jobsAPI, applicationsAPI } from "../services/api";
import {
  Building2,
  Users,
  Briefcase,
  PlusCircle,
  FileCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Settings,
  Search,
  Filter,
} from "lucide-react";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applicants"); // "applicants" | "post-job" | "manage-jobs" | "company-profile"
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Applicant Filtering State
  const [filterJobId, setFilterJobId] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSearch, setFilterSearch] = useState("");

  // Post Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    jobType: "Full-time",
    experienceLevel: "Entry Level",
    category: "Software Development",
    location: "Remote",
    salaryMin: 800000,
    salaryMax: 1500000,
    description: "",
    requirements: "",
    skillsRequired: "",
    openings: 1,
  });

  // Company Register Form State (if recruiter has no company profile yet)
  const [createCompanyForm, setCreateCompanyForm] = useState({
    name: "",
    tagline: "",
    description: "",
    website: "",
    location: "Remote",
    industry: "Technology",
  });

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const compRes = await companiesAPI.getMyCompany();
      const comp = compRes.data.company;
      setCompany(comp);
      setJobs(compRes.data.jobs || []);

      if (comp) {
        const appsRes = await applicationsAPI.getCompanyApplications(comp._id);
        setApplicants(appsRes.data.applications || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load recruiter data. Please ensure you are logged in as a recruiter.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateApplicantStatus = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
      setSuccessMsg(`Applicant status updated to "${newStatus}"`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!company) {
      alert("Please configure your company profile first.");
      return;
    }

    try {
      await jobsAPI.create({
        ...jobForm,
        companyId: company._id,
      });

      setSuccessMsg("Job opening published successfully!");
      setActiveTab("manage-jobs");
      loadDashboardData();
      // Reset form
      setJobForm({
        title: "",
        jobType: "Full-time",
        experienceLevel: "Entry Level",
        category: "Software Development",
        location: "Remote",
        salaryMin: 800000,
        salaryMax: 1500000,
        description: "",
        requirements: "",
        skillsRequired: "",
        openings: 1,
      });
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post job");
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await companiesAPI.create(createCompanyForm);
      setSuccessMsg("Company registered successfully!");
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create company");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading recruiter workspace...</p>
      </div>
    );
  }

  // If user is not yet associated with any company
  if (!company) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-center">
          <Building2 className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Set Up Your Employer Profile
          </h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Register your company to receive multi-company applications and manage openings
          </p>

          <form onSubmit={handleCreateCompany} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={createCompanyForm.name}
                onChange={(e) => setCreateCompanyForm({ ...createCompanyForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={createCompanyForm.tagline}
                onChange={(e) => setCreateCompanyForm({ ...createCompanyForm, tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Innovating the future of cloud computing"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Industry</label>
                <select
                  value={createCompanyForm.industry}
                  onChange={(e) => setCreateCompanyForm({ ...createCompanyForm, industry: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Technology">Technology</option>
                  <option value="Travel & Hospitality Tech">Travel Tech</option>
                  <option value="Financial Technology">FinTech</option>
                  <option value="Healthcare & AI">Healthcare & AI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">HQ Location</label>
                <input
                  type="text"
                  value={createCompanyForm.location}
                  onChange={(e) => setCreateCompanyForm({ ...createCompanyForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Bengaluru / Remote"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={createCompanyForm.description}
                onChange={(e) => setCreateCompanyForm({ ...createCompanyForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Briefly describe what your company does and why candidates love working here..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
            >
              Create Company & Open Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredApplicants = applicants.filter((app) => {
    if (filterJobId !== "ALL") {
      const jId = app.job?._id || app.job;
      if (jId !== filterJobId) return false;
    }
    if (filterStatus !== "ALL" && app.status !== filterStatus) {
      return false;
    }
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      const matchName = app.applicantName?.toLowerCase().includes(q);
      const matchEmail = app.applicantEmail?.toLowerCase().includes(q);
      const matchJob = app.job?.title?.toLowerCase().includes(q);
      const matchSkills = app.skills?.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchJob && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              company.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff`
            }
            alt={company.name}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                Employer Dashboard
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {company.industry} • {company.location} • {jobs.length} Active Openings
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("post-job")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opening</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dashboard Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab("applicants")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === "applicants"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Applicants ({applicants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("manage-jobs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === "manage-jobs"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Jobs ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("post-job")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === "post-job"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Job</span>
        </button>
      </div>

      {/* TAB 1: APPLICANTS PIPELINE */}
      {activeTab === "applicants" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Incoming Applications ({applicants.length})
              </h2>
              <p className="text-xs text-gray-500">
                Review candidate credentials, filter by opening, and update hiring stages
              </p>
            </div>
            {applicants.length > 0 && (
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full self-start sm:self-auto">
                Showing {filteredApplicants.length} of {applicants.length}
              </span>
            )}
          </div>

          {/* Filter Toolbar */}
          {applicants.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search candidate name, email, skills..."
                  className="w-full pl-8 pr-3 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                />
              </div>

              {/* Job Filter */}
              <div>
                <select
                  value={filterJobId}
                  onChange={(e) => setFilterJobId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 cursor-pointer"
                >
                  <option value="ALL">All Job Openings ({jobs.length})</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} ({j.jobType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 cursor-pointer"
                >
                  <option value="ALL">All Application Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Accepted">Accepted / Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          )}

          {applicants.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h3 className="font-bold text-gray-800">No Applications Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Candidates applying directly or via multi-company batch apply will appear here.
              </p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
              <p className="font-semibold text-gray-700">
                No candidates match your current filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterJobId("ALL");
                  setFilterStatus("ALL");
                  setFilterSearch("");
                }}
                className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-indigo-200 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-gray-900">
                          {app.applicantName}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {app.job?.title || "General Application"}
                        </span>
                        {app.batchApplicationId && (
                          <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                            Multi-Batch Applicant
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600">
                        {app.applicantEmail} {app.applicantPhone && `• ${app.applicantPhone}`}
                      </p>

                      {app.skills && app.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {app.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {app.coverLetter && (
                        <p className="text-xs text-gray-500 italic mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          "{app.coverLetter}"
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-3 text-xs">
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View Resume
                          </a>
                        )}
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex flex-col sm:items-end gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                        Update Status
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleUpdateApplicantStatus(app._id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                          app.status === "Accepted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : app.status === "Shortlisted"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : app.status === "Interviewing"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                            : app.status === "Rejected"
                            ? "bg-gray-100 text-gray-600 border-gray-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Accepted">Accepted / Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <span className="text-[10px] text-gray-400">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POST NEW JOB OPENING */}
      {activeTab === "post-job" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Publish New Job Opening</h2>
          <p className="text-xs text-gray-500 mb-6">
            Candidates across the platform will be able to discover and batch apply to this role
          </p>

          <form onSubmit={handlePostJob} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g. Senior Frontend React Developer"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={jobForm.jobType}
                  onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={jobForm.experienceLevel}
                  onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Fresher">Fresher / Intern</option>
                  <option value="Entry Level">Entry Level (1-2 yrs)</option>
                  <option value="Mid Level">Mid Level (3-5 yrs)</option>
                  <option value="Senior Level">Senior Level (5+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="e.g. Remote / Bengaluru"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Salary Min (₹ / yr)
                </label>
                <input
                  type="number"
                  value={jobForm.salaryMin}
                  onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Salary Max (₹ / yr)
                </label>
                <input
                  type="number"
                  value={jobForm.salaryMax}
                  onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Required Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={jobForm.skillsRequired}
                onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                rows={4}
                required
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                placeholder="Describe role responsibilities, team structure, and projects..."
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              Publish Job Opening
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MANAGE ACTIVE JOBS */}
      {activeTab === "manage-jobs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-gray-900">
              Active Job Postings ({jobs.length})
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500">No active job postings yet.</p>
              <button
                onClick={() => setActiveTab("post-job")}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{job.jobType}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
