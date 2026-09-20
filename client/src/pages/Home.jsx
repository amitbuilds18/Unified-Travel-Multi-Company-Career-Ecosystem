import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { companiesAPI, jobsAPI } from "../services/api";
import {
  Layers,
  Sparkles,
  Building2,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Zap,
  Shield,
  TrendingUp,
  Compass,
} from "lucide-react";

export default function Home() {
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    companiesAPI
      .getAll()
      .then((res) => {
        setFeaturedCompanies((res.data.companies || []).slice(0, 4));
      })
      .catch(() => {});

    jobsAPI
      .getAll()
      .then((res) => {
        setRecentJobs((res.data.jobs || []).slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 px-4">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-6 shadow-xs animate-bounce-short">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Gen Multi-Company Application Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Apply to Multiple Companies <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              in a Single Click.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stop filling repetitive application forms. Select verified companies, customize your profile once, and submit applications simultaneously with real-time status tracking.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Browse Jobs & Batch Apply</span>
            </Link>

            <Link
              to="/companies"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl border border-gray-200 shadow-xs flex items-center justify-center gap-2 transition text-sm"
            >
              <Building2 className="w-4 h-4 text-gray-500" />
              <span>Explore Companies</span>
            </Link>
          </div>

          {/* Metric Highlights */}
          <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">500+</p>
              <p className="text-xs text-gray-500 mt-0.5">Verified Employers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-600">1-Click</p>
              <p className="text-xs text-gray-500 mt-0.5">Multi-Apply Desk</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">100%</p>
              <p className="text-xs text-gray-500 mt-0.5">Real-Time Status</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">48h</p>
              <p className="text-xs text-gray-500 mt-0.5">Avg. Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Multi-Apply Workflow */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Supercharge Your Job Search in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-lg text-gray-900">Browse Openings</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Explore positions across verified technology companies, travel platforms, and fin-tech leaders.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-lg text-gray-900">Multi-Select with Checkboxes</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Tick 2, 5, or 10+ jobs you like. Our floating multi-apply bar collects them into one batch queue.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-lg text-gray-900">1-Click Apply & Track</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Submit your resume and cover message once. Track hiring stages (Under Review, Shortlisted, Offer) on your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      {featuredCompanies.length > 0 && (
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Featured Verified Companies
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Actively hiring talent right now</p>
            </div>
            <Link
              to="/companies"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCompanies.map((c) => (
              <Link
                key={c._id}
                to={`/companies/${c.slug || c._id}`}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-300 transition group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      c.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D8ABC&color=fff`
                    }
                    alt={c.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-blue-600 transition flex items-center gap-1">
                      <span>{c.name}</span>
                      {c.verified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate">{c.industry}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">{c.location}</span>
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {c.jobsCount || 0} Openings
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Travel & Destinations Showcase CTA */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200 mb-3">
              <Compass className="w-3.5 h-3.5" /> Partner Travel Experiences
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Looking for Curated Travel Packages?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 mt-2 leading-relaxed">
              Explore our verified partner destinations, hotels, and customized trip itineraries with secure Razorpay booking.
            </p>
          </div>

          <Link
            to="/destinations"
            className="px-6 py-3 bg-white hover:bg-teal-50 text-teal-900 font-bold rounded-xl text-xs sm:text-sm shadow-md transition whitespace-nowrap cursor-pointer"
          >
            Explore Travel Destinations →
          </Link>
        </div>
      </section>
    </div>
  );
}
