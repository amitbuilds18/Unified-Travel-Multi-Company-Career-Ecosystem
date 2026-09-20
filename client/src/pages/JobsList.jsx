import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobsAPI } from "../services/api";
import BatchApplyModal from "../components/BatchApplyModal";
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

  // Multi-Selection State for Batch Apply
  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [modalJobs, setModalJobs] = useState([]);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-8">
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

          {(search || jobType !== "All" || category !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setJobType("All");
                setCategory("All");
              }}
              className="text-xs text-blue-600 hover:underline px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>

        {/* Multi-Select Helper */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-gray-100 transition"
          >
            {selectedJobIds.size === jobs.length && jobs.length > 0 ? (
              <>
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-gray-400" />
                <span>Select All ({jobs.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

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
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && jobs.length === 0 && (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100 my-6">
          <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-800">No Openings Match Your Filters</h3>
          <p className="text-sm text-gray-500 mt-1">Try clearing your search term or selecting another category.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isSelected = selectedJobIds.has(job._id);
            const company = job.company || {};

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
                  <div className="flex items-start gap-4">
                    {/* Multi-apply Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleSelectJob(job._id)}
                      className="mt-1 text-gray-400 hover:text-blue-600 transition"
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
                    <div>
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
                          {job.skillsRequired.map((skill, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
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
                      {isSelected ? "✓ Included in Batch" : "+ Select for Multi-Apply"}
                    </button>
                  </div>
                </div>
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
              className="text-xs text-gray-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={handleBatchApply}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Apply to All Selected</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Batch Apply Modal */}
      {showBatchModal && (
        <BatchApplyModal
          selectedJobs={modalJobs}
          onClose={() => setShowBatchModal(false)}
          onSuccess={() => {
            // Uncheck submitted jobs
            setSelectedJobIds(new Set());
          }}
        />
      )}
    </div>
  );
}
