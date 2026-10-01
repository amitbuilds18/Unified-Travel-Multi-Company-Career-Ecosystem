import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobsAPI, authAPI } from "../services/api";
import BatchApplyModal from "../components/BatchApplyModal";
import { calculateATSScore } from "../utils/atsMatcher";
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  BadgeCheck,
  Filter,
  DollarSign,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  X,
  Zap,
  TrendingUp,
  Plus,
  Heart,
  BookmarkCheck,
} from "lucide-react";

export default function JobsList() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [category, setCategory] = useState("All");

  // AI ATS Matcher State
  const [candidateSkills, setCandidateSkills] = useState([
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Tailwind CSS",
    "TypeScript",
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [atsFilter, setAtsFilter] = useState("ALL"); // "ALL" | "HIGH" | "MODERATE"
  const [sortBy, setSortBy] = useState("DEFAULT"); // "DEFAULT" | "MATCH" | "SALARY"
  const [expandedMatchJobId, setExpandedMatchJobId] = useState(null);

  // Multi-Selection State for Batch Apply
  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [modalJobs, setModalJobs] = useState([]);

  // Saved Jobs / Bookmarks State
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [saveActionLoading, setSaveActionLoading] = useState(null);

  // Load candidate profile skills and saved jobs if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (Array.isArray(u.skills) && u.skills.length > 0) {
          setCandidateSkills(u.skills);
        } else if (typeof u.skills === "string" && u.skills.trim()) {
          setCandidateSkills(u.skills.split(",").map((s) => s.trim()));
        }
        if (Array.isArray(u.savedJobs)) {
          const ids = u.savedJobs.map((item) =>
            typeof item === "object" && item?._id ? item._id : item
          );
          setSavedJobIds(new Set(ids));
        }
      }
    } catch {}

    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getProfile()
        .then((res) => {
          const u = res.data?.user;
          if (u && Array.isArray(u.savedJobs)) {
            const ids = u.savedJobs.map((item) =>
              typeof item === "object" && item?._id ? item._id : item
            );
            setSavedJobIds(new Set(ids));
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleToggleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to save jobs to your bookmarks ❤️");
      return;
    }

    // Optimistic toggle
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });

    try {
      setSaveActionLoading(jobId);
      const res = await authAPI.toggleSaveJob(jobId);
      if (res.data?.savedJobs) {
        const ids = res.data.savedJobs.map((item) =>
          typeof item === "object" && item?._id ? item._id : item
        );
        setSavedJobIds(new Set(ids));

        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            u.savedJobs = res.data.savedJobs;
            localStorage.setItem("user", JSON.stringify(u));
          } catch {}
        }
      }
    } catch (err) {
      console.error("Failed to toggle save job:", err);
      // Revert optimistic toggle
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        if (next.has(jobId)) next.delete(jobId);
        else next.add(jobId);
        return next;
      });
    } finally {
      setSaveActionLoading(null);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const clean = newSkillInput.trim();
    if (!candidateSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      const updated = [...candidateSkills, clean];
      setCandidateSkills(updated);
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          u.skills = updated;
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch {}
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = candidateSkills.filter((s) => s !== skillToRemove);
    setCandidateSkills(updated);
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        u.skills = updated;
        localStorage.setItem("user", JSON.stringify(u));
      }
    } catch {}
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (jobType !== "All") params.jobType = jobType;
      if (category !== "All") params.category = category;

      const res = await jobsAPI.getAll(params);
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs. Please ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  // Toggle selection for a single job
  const toggleSelectJob = (jobId) => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  // Select all or clear
  const toggleSelectAll = () => {
    if (selectedJobIds.size === jobs.length) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(jobs.map((j) => j._id)));
    }
  };

  // Trigger batch apply modal for selected jobs
  const handleBatchApply = () => {
    const chosen = jobs.filter((j) => selectedJobIds.has(j._id));
    if (chosen.length === 0) return;
    setModalJobs(chosen);
    setShowBatchModal(true);
  };

  // Trigger single apply modal for one specific job
  const handleSingleApply = (job) => {
    setModalJobs([job]);
    setShowBatchModal(true);
  };

  // Format salary
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return "Competitive";
    const curr = currency === "INR" ? "₹" : "$";
    if (min && max) {
      return `${curr}${(min / 100000).toFixed(1)}L - ${curr}${(max / 100000).toFixed(1)}L / yr`;
    }
    return `${curr}${((min || max) / 100000).toFixed(1)}L / yr`;
  };

  // Calculate ATS match for every job
  const jobsWithAts = jobs.map((job) => {
    const ats = calculateATSScore(candidateSkills, job);
    return { ...job, ats };
  });

  // Filter and sort jobs based on ATS, saved status, and salary criteria
  const processedJobs = jobsWithAts
    .filter((job) => {
      if (showOnlySaved && !savedJobIds.has(job._id)) return false;
      if (atsFilter === "HIGH") return job.ats.score >= 80;
      if (atsFilter === "MODERATE") return job.ats.score >= 50;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "MATCH") return b.ats.score - a.ats.score;
      if (sortBy === "SALARY") return (b.salaryMax || 0) - (a.salaryMax || 0);
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-6">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Multi-Company Hiring Engine</span>
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Apply to Multiple Companies in 1-Click
          </h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            Select high-growth companies and openings using checkboxes below, then click{" "}
            <span className="font-bold underline decoration-blue-300">"Apply to Selected"</span> to submit your profile simultaneously.
          </p>

          {/* Search bar inside hero */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, skill (e.g. React, Node.js), or keywords..."
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm focus:outline-hidden shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/30 cursor-pointer"
            >
              Find Jobs
            </button>
          </form>
        </div>
      </div>

      {/* INTERACTIVE AI ATS MATCH ENGINE WIDGET */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100 shadow-sm mb-6 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-gray-900">
                  AI ATS Skill Match Engine
                </h3>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  Live Calculator
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Simulating applicant tracking systems. Match percentages update live as you add or remove skills below.
              </p>
            </div>
          </div>

          {/* Quick ATS Match Filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setAtsFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                atsFilter === "ALL"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Matches
            </button>
            <button
              type="button"
              onClick={() => setAtsFilter("HIGH")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                atsFilter === "HIGH"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>⚡ 80%+ High Fit</span>
            </button>
            <button
              type="button"
              onClick={() => setAtsFilter("MODERATE")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                atsFilter === "MODERATE"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              50%+ Match
            </button>
          </div>
        </div>

        {/* Candidate Skills Pills & Add Skill Form */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-indigo-100">
          <span className="text-xs font-bold text-gray-700 mr-1 flex items-center gap-1">
            <span>Your Active Skills ({candidateSkills.length}):</span>
          </span>

          {candidateSkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white text-gray-800 border border-indigo-200/80 shadow-2xs group hover:border-red-300 hover:bg-red-50/30 transition"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-gray-400 group-hover:text-red-500 hover:scale-125 transition cursor-pointer"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Inline Add Skill Input */}
          <form onSubmit={handleAddSkill} className="inline-flex items-center gap-1">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="+ Add skill (e.g. Docker, Python)..."
              className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-52 shadow-2xs"
            />
            {newSkillInput.trim() && (
              <button
                type="submit"
                className="px-2.5 py-1 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                Add
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Filter and Selection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none transition cursor-pointer"
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none transition cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Software Development">Software Development</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Design">UI/UX Design</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700 outline-none transition cursor-pointer"
          >
            <option value="DEFAULT">Sort: Default</option>
            <option value="MATCH">Sort: Highest ATS Match ⚡</option>
            <option value="SALARY">Sort: Highest Salary 💰</option>
          </select>

          {/* Saved Jobs Wishlist Filter Button */}
          <button
            type="button"
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              showOnlySaved
                ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                : savedJobIds.size > 0
                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                showOnlySaved || savedJobIds.size > 0 ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
            <span>Saved Jobs ({savedJobIds.size})</span>
          </button>

          {(search || jobType !== "All" || category !== "All" || atsFilter !== "ALL" || sortBy !== "DEFAULT" || showOnlySaved) && (
            <button
              onClick={() => {
                setSearch("");
                setJobType("All");
                setCategory("All");
                setAtsFilter("ALL");
                setSortBy("DEFAULT");
                setShowOnlySaved(false);
              }}
              className="text-xs text-blue-600 hover:underline px-2 py-1 cursor-pointer font-semibold"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Multi-Select Helper */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            {selectedJobIds.size === processedJobs.length && processedJobs.length > 0 ? (
              <>
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-gray-400" />
                <span>Select All ({processedJobs.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Jobs Banner with 1-Click Multi Apply */}
      {showOnlySaved && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-rose-900">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-rose-950">
                Saved Openings Wishlist ({processedJobs.length})
              </p>
              <p className="text-rose-700 text-xs">
                Review your bookmarked positions or apply to all of them at once with your profile.
              </p>
            </div>
          </div>
          {processedJobs.length > 0 && (
            <button
              onClick={() => {
                const allSavedIds = new Set(processedJobs.map((j) => j._id));
                setSelectedJobIds(allSavedIds);
                setModalJobs(processedJobs);
                setShowBatchModal(true);
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              <span>1-Click Apply to All Saved ({processedJobs.length})</span>
            </button>
          )}
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 font-medium">Fetching active openings across verified companies...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 my-8">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchJobs}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && processedJobs.length === 0 && (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100 my-6">
          <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-800">
            {showOnlySaved ? "No Saved Jobs in Wishlist" : "No Openings Match Your Filters"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {showOnlySaved
              ? "Click the ❤️ heart icon on any job card to save it for quick review and 1-click batch application."
              : "Try resetting your ATS fit filter or search keywords."}
          </p>
          {showOnlySaved && (
            <button
              onClick={() => setShowOnlySaved(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Browse All Openings
            </button>
          )}
        </div>
      )}

      {!loading && !error && processedJobs.length > 0 && (
        <div className="space-y-4">
          {processedJobs.map((job) => {
            const isSelected = selectedJobIds.has(job._id);
            const company = job.company || {};
            const ats = job.ats;
            const isExpanded = expandedMatchJobId === job._id;

            return (
              <div
                key={job._id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-sm ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Checkbox + Logo + Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Multi-apply Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleSelectJob(job._id)}
                      className="mt-1 text-gray-400 hover:text-blue-600 transition cursor-pointer"
                      title={isSelected ? "Remove from Multi-Apply" : "Select for Multi-Apply"}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-6 h-6 text-blue-600 fill-blue-50" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>

                    {/* Company Logo */}
                    <img
                      src={
                        company.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || "C")}&background=0D8ABC&color=fff`
                      }
                      alt={company.name || "Company"}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-xs shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/companies/${company.slug || company._id}`}
                          className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
                        >
                          <span>{company.name}</span>
                          {company.verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" title="Verified Company" />
                          )}
                        </Link>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {job.location}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        {job.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Badges: Type, Experience, Salary */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                          {job.jobType}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {job.experienceLevel}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                        </span>
                      </div>

                      {/* Skills Tags */}
                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          {job.skillsRequired.map((skill, i) => {
                            const isMatched = ats.matchedSkills.includes(skill);
                            return (
                              <span
                                key={i}
                                className={`text-[11px] font-medium px-2 py-0.5 rounded border transition ${
                                  isMatched
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold"
                                    : "bg-gray-50 text-gray-500 border-gray-100"
                                }`}
                              >
                                {isMatched ? `✓ ${skill}` : skill}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: ATS Match Pill + Apply Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                    {/* Live ATS Match Badge Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedMatchJobId(isExpanded ? null : job._id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer hover:shadow-xs ${ats.badgeColor}`}
                      title="Click to view full ATS skill analysis breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{ats.score}% ATS Match</span>
                      <span className="hidden sm:inline font-normal text-[10px] opacity-80">
                        • {ats.label}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSaveJob(job._id)}
                        disabled={saveActionLoading === job._id}
                        className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          savedJobIds.has(job._id)
                            ? "bg-rose-50 text-rose-600 border-rose-200 shadow-2xs hover:bg-rose-100"
                            : "bg-white text-gray-400 border-gray-200 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/40"
                        }`}
                        title={
                          savedJobIds.has(job._id)
                            ? "Remove from Saved Jobs"
                            : "Save Job to Bookmarks ❤️"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform active:scale-125 ${
                            savedJobIds.has(job._id)
                              ? "fill-rose-500 text-rose-500"
                              : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleSingleApply(job)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        Apply Directly
                      </button>

                      <button
                        onClick={() => toggleSelectJob(job._id)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {isSelected ? "✓ Selected" : "+ Batch Apply"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable ATS Match Breakdown Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-gray-100 bg-gray-50/70 p-4 rounded-xl space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>
                          ATS Match Analysis: {ats.matchCount} of {ats.totalRequired} requirements met
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {ats.score >= 80
                          ? "🎯 High interview callback probability"
                          : "💡 Add missing keywords to boost ranking"}
                      </span>
                    </div>

                    {/* Matched Skills */}
                    {ats.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-emerald-800 mr-1">
                          Matching Strengths:
                        </span>
                        {ats.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-900 font-semibold text-[10px] border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Missing Skills */}
                    {ats.missingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-amber-800 mr-1">
                          Missing in your profile:
                        </span>
                        {ats.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-medium text-[10px] border border-amber-200/80"
                          >
                            <span>+</span>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Multi-Apply Bar */}
      {selectedJobIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-gray-700/50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/30">
              {selectedJobIds.size}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">
                {selectedJobIds.size} {selectedJobIds.size === 1 ? "Opening" : "Openings"} Selected
              </p>
              <p className="text-xs text-gray-400">
                Ready for 1-Click Multi-Company Submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedJobIds(new Set())}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 transition cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleBatchApply}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply to Selected ({selectedJobIds.size})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multi-Company Application Modal */}
      {showBatchModal && (
        <BatchApplyModal
          selectedJobs={modalJobs}
          onClose={() => setShowBatchModal(false)}
          onSuccess={() => {
            setSelectedJobIds(new Set());
            setShowBatchModal(false);
          }}
        />
      )}
    </div>
  );
}
