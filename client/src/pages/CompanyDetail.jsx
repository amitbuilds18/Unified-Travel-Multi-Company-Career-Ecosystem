import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { companiesAPI } from "../services/api";
import BatchApplyModal from "../components/BatchApplyModal";
import {
  Building2,
  BadgeCheck,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function CompanyDetail() {
  const { idOrSlug } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply Modal
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    companiesAPI
      .getByIdOrSlug(idOrSlug)
      .then((res) => {
        setCompany(res.data.company);
        setJobs(res.data.jobs || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Company not found or failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleApplyToJob = (job) => {
    setSelectedJobForModal({
      ...job,
      company: company,
    });
    setShowApplyModal(true);
  };

  const handleGeneralApply = () => {
    setSelectedJobForModal({
      _id: null,
      title: "General Application",
      jobType: "Flexible",
      company: company,
    });
    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading company profile...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl text-center">
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <p className="font-bold">{error || "Company not found"}</p>
          <Link
            to="/companies"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Companies Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Link */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies Directory
      </Link>

      {/* Header Banner Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative"></div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={
                  company.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff`
                }
                alt={company.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  {company.verified && (
                    <BadgeCheck className="w-5 h-5 text-blue-600" title="Verified Employer" />
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium">{company.tagline || company.industry}</p>
              </div>
            </div>

            <button
              onClick={handleGeneralApply}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              Submit General Application
            </button>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {company.location || "Remote"}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              {company.employeeCount}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              Founded {company.foundedYear}
            </span>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Globe className="w-4 h-4 text-blue-500" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid: About + Openings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: About & Overview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
              About the Company
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {company.description}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              Direct Contact
            </h2>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{company.email}</span>
              </div>
              {company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{company.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Open Positions */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Active Openings ({jobs.length})</span>
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
              <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">No open positions at this moment.</p>
              <button
                onClick={handleGeneralApply}
                className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
              >
                Send a general application anyway →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{job.jobType}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                      </span>
                    </div>

                    {job.skillsRequired && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skillsRequired.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleApplyToJob(job)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Batch / Single Apply Modal */}
      {showApplyModal && selectedJobForModal && (
        <BatchApplyModal
          selectedJobs={[selectedJobForModal]}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
}
