import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, applicationsAPI } from "../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Globe,
  CheckCircle2,
  Save,
  ArrowRight,
  Heart,
  Trash2,
  ExternalLink,
  Zap,
  Building2,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stats, setStats] = useState({ total: 0 });
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "saved"
  const [savedJobs, setSavedJobs] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    phone: "",
    headline: "",
    bio: "",
    skills: "",
    resumeUrl: "",
    experienceYears: 0,
    location: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    authAPI
      .getProfile()
      .then((res) => {
        const u = res.data.user;
        setForm({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "user",
          phone: u.phone || "",
          headline: u.headline || "",
          bio: u.bio || "",
          skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
          resumeUrl: u.resumeUrl || "",
          experienceYears: u.experienceYears || 0,
          location: u.location || "",
          portfolioUrl: u.portfolioUrl || "",
          githubUrl: u.githubUrl || "",
          linkedinUrl: u.linkedinUrl || "",
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));

    applicationsAPI
      .getMyApplications()
      .then((res) => {
        if (res.data?.stats) setStats(res.data.stats);
      })
      .catch(() => {});

    authAPI
      .getSavedJobs()
      .then((res) => {
        setSavedJobs(res.data?.savedJobs || []);
      })
      .catch(() => {});
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
      await authAPI.toggleSaveJob(jobId);
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (Array.isArray(u.savedJobs)) {
            u.savedJobs = u.savedJobs.filter(
              (item) => (typeof item === "object" && item?._id ? item._id : item) !== jobId
            );
            localStorage.setItem("user", JSON.stringify(u));
          }
        } catch {}
      }
    } catch (err) {
      console.error("Failed to remove saved job:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await authAPI.updateProfile(form);
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("authChange"));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {form.name ? form.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
            <p className="text-xs sm:text-sm text-gray-500">{form.headline || "Job Candidate"}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
              Role: {form.role === "company_admin" ? "Employer / Recruiter" : "Job Seeker"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("saved")}
            className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-xl text-xs sm:text-sm border transition cursor-pointer ${
              activeTab === "saved"
                ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === "saved" ? "fill-white" : "fill-rose-500"}`} />
            <span>Saved Jobs ({savedJobs.length})</span>
          </button>

          <Link
            to="/my-applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs sm:text-sm border border-gray-200 transition"
          >
            <span>My Applications ({stats.total || 0})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Candidate Profile & ATS Setup
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "saved"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === "saved" ? "fill-rose-600" : ""}`} />
          <span>Saved Jobs Wishlist ({savedJobs.length})</span>
        </button>
      </div>

      {savedSuccess && activeTab === "profile" && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Profile Form Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900">Personal & Contact Details</h2>
          <p className="text-xs text-gray-500 mt-0.5">These will pre-populate when applying to multiple companies</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Cannot be modified)</label>
            <input
              type="email"
              disabled
              value={form.email}
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Bengaluru, India"
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Headline</label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Full-Stack Engineer | React & Node.js"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Summary</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Share your technical interests, achievements, and what you're looking for..."
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Resume & Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Resume / CV Link</label>
              <input
                type="url"
                value={form.resumeUrl}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/my-resume.pdf"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Portfolio Link</label>
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                  placeholder="https://myportfolio.dev"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
      )}

      {/* Saved Jobs Wishlist Tab */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span>Bookmarked Openings ({savedJobs.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Roles you have saved. You can manage bookmarks or jump straight to the multi-apply engine.
              </p>
            </div>
            {savedJobs.length > 0 && (
              <Link
                to="/jobs"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                <span>Open Multi-Apply Engine</span>
              </Link>
            )}
          </div>

          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-800">No Saved Jobs Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Explore verified company vacancies and click the ❤️ bookmark icon to keep them saved for batch applications.
              </p>
              <Link
                to="/jobs"
                className="inline-block mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                Explore Openings
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={
                        job.company?.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          job.company?.name || "C"
                        )}&background=0D8ABC&color=fff`
                      }
                      alt={job.company?.name || "Company"}
                      className="w-11 h-11 rounded-xl object-cover border border-gray-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-700">
                          {job.company?.name}
                        </span>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {job.location}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mt-0.5">{job.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {job.jobType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                          {job.salaryCurrency === "INR" ? "₹" : "$"}
                          {((job.salaryMin || job.salaryMax || 0) / 100000).toFixed(1)}L / yr
                        </span>
                        {job.category && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700">
                            {job.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <button
                      onClick={() => handleRemoveSavedJob(job._id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition border border-gray-200 cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to="/jobs"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}