import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { companiesAPI } from "../services/api";
import {
  Building2,
  BadgeCheck,
  MapPin,
  Users,
  Briefcase,
  Search,
  ExternalLink,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (industry !== "All") params.industry = industry;

      const res = await companiesAPI.getAll(params);
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load companies list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [industry]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Verified Employer Directory
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Top Hiring Companies
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Discover top-tier tech firms, startups, and agencies hiring now
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </form>

          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 outline-none"
          >
            <option value="All">All Industries</option>
            <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
            <option value="Travel & Hospitality Tech">Travel Tech</option>
            <option value="Financial Technology">FinTech</option>
            <option value="Healthcare & AI">Healthcare & AI</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Loading companies...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 my-8">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && companies.length === 0 && (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-200 my-6">
          <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-800">No Companies Found</h3>
          <p className="text-sm text-gray-500 mt-1">Try another search term or industry filter.</p>
        </div>
      )}

      {/* Companies Grid */}
      {!loading && !error && companies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition hover:border-blue-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        company.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff`
                      }
                      alt={company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                          <Link to={`/companies/${company.slug || company._id}`}>
                            {company.name}
                          </Link>
                        </h2>
                        {company.verified && (
                          <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" title="Verified Company" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{company.industry}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {company.jobsCount || 0} {company.jobsCount === 1 ? "Job" : "Jobs"}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-4 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {company.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {company.employeeCount || "10-50 team"}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 flex items-center justify-between">
                <Link
                  to={`/companies/${company.slug || company._id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                >
                  <span>Explore Openings & Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to={`/jobs?company=${company._id}`}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 transition"
                >
                  View Roles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
