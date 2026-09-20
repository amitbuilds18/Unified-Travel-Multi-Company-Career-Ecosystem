import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { applicationsAPI } from "../services/api";
import {
  FileCheck2,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await applicationsAPI.getMyApplications();
      setApplications(res.data.applications || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load your applications. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Under Review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shortlisted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Interviewing":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredApps =
    statusFilter === "All"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Candidate Command Center
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            My Applications Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor real-time status across all companies you've applied to
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Apply to More Companies</span>
        </Link>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Total Applied</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
          <p className="text-xs font-semibold text-blue-600">Under Review</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{stats.underReview || stats.pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <p className="text-xs font-semibold text-purple-600">Shortlisted</p>
          <p className="text-2xl font-black text-purple-700 mt-1">{stats.shortlisted || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600">Offers / Accepted</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.accepted || 0}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-gray-200 text-xs font-medium">
        {["All", "Pending", "Under Review", "Shortlisted", "Interviewing", "Accepted", "Rejected"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab
                  ? "bg-gray-900 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Loading your applications...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 my-6">
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
          >
            Log In
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredApps.length === 0 && (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-200 my-6">
          <FileCheck2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">
            {statusFilter === "All" ? "No Applications Submitted Yet" : `No Applications in '${statusFilter}'`}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            You haven't submitted any applications yet. Select multiple companies on the jobs page to batch apply!
          </p>
          <Link
            to="/jobs"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
          >
            Browse Jobs & Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Applications Cards List */}
      {!loading && !error && filteredApps.length > 0 && (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const company = app.company || {};
            const job = app.job || {};

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs hover:border-gray-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Company + Job Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        company.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || "C")}&background=0D8ABC&color=fff`
                      }
                      alt={company.name || "Company"}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-xs shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900">
                          {job.title || "General Application"}
                        </h3>
                        {app.batchApplicationId && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-medium">
                            Multi-Batch
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mt-0.5 font-medium">
                        {company.name} • {company.location || "Remote"}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </span>

                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Submitted Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      ● {app.status}
                    </span>

                    {app.recruiterNotes && (
                      <p className="text-[11px] text-gray-500 italic max-w-xs text-right">
                        Note: "{app.recruiterNotes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
