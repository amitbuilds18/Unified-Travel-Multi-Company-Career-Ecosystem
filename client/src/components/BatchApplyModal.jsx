import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applicationsAPI } from "../services/api";
import {
  X,
  CheckCircle2,
  Building2,
  Briefcase,
  Send,
  FileText,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { calculateBatchATS } from "../utils/atsMatcher";

export default function BatchApplyModal({ selectedJobs = [], onClose, onSuccess }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    resumeUrl: "",
    coverLetter: "Hi Hiring Team, I am eager to apply for this opening and contribute my skills to your company's growth.",
    portfolioUrl: "",
    skills: "",
    experienceYears: 1,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setForm((prev) => ({
          ...prev,
          applicantName: u.name || "",
          applicantEmail: u.email || "",
          applicantPhone: u.phone || "",
          resumeUrl: u.resumeUrl || "https://example.com/my-resume.pdf",
          portfolioUrl: u.portfolioUrl || "",
          skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "React, Node.js, JavaScript",
          experienceYears: u.experienceYears || 1,
        }));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to submit applications!");
      navigate("/auth");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        applications: selectedJobs.map((job) => ({
          companyId: job.company?._id || job.company,
          jobId: job._id,
        })),
        applicantName: form.applicantName,
        applicantEmail: form.applicantEmail,
        applicantPhone: form.applicantPhone,
        resumeUrl: form.resumeUrl,
        coverLetter: form.coverLetter,
        portfolioUrl: form.portfolioUrl,
        skills: form.skills,
        experienceYears: Number(form.experienceYears) || 0,
      };

      const res = await applicationsAPI.batchApply(payload);
      setResult(res.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Batch apply failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit applications. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
              Multi-Company Application Desk
            </span>
            <h2 className="text-xl font-bold mt-1">
              Apply to {selectedJobs.length} {selectedJobs.length === 1 ? "Company" : "Companies"} in 1-Click
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {result ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Applications Successfully Sent!
              </h3>
              <p className="text-gray-600 text-sm mt-1 max-w-md mx-auto">
                Your profile was delivered to <strong>{result.appliedCount} companies</strong>.
                {result.skippedCount > 0 && ` (${result.skippedCount} skipped as already applied).`}
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-600">
                Batch Ref: {result.batchApplicationId}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  onClose();
                  navigate("/my-applications");
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/20"
              >
                Track In "My Applications"
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ATS Match Compatibility Banner */}
            {(() => {
              const batchAts = calculateBatchATS(form.skills, selectedJobs);
              return (
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200/70 flex items-center justify-between text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-black text-gray-900">
                        <span>Batch ATS Fit: {batchAts.avgScore}% Match</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {batchAts.avgScore >= 80 ? "Optimal Candidate Fit" : "Competitive Match"}
                        </span>
                      </div>
                      {batchAts.topMatches.length > 0 && (
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          Top Strengths:{" "}
                          <span className="font-semibold text-emerald-700">
                            {batchAts.topMatches.slice(0, 4).join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Selected Companies Preview Pill Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Selected Openings & Companies ({selectedJobs.length})
              </label>
              <div className="max-h-36 overflow-y-auto space-y-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                {selectedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{job.title}</span>
                        <span className="text-gray-500 ml-1.5 font-medium">
                          at {job.company?.name || "Company"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                      {job.jobType}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.applicantName}
                  onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.applicantEmail}
                  onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your Email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.applicantPhone}
                  onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Resume Link */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Resume / CV Link (Google Drive, LinkedIn, or Cloud PDF)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  required
                  value={form.resumeUrl}
                  onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                All selected companies will review this resume link directly.
              </p>
            </div>

            {/* Skills & Portfolio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Key Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Portfolio / GitHub Link
                </label>
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/yourhandle"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brief Introduction / Cover Message to Hiring Teams
              </label>
              <textarea
                rows={3}
                value={form.coverLetter}
                onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Share why you are excited to work with these companies..."
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || selectedJobs.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit to {selectedJobs.length} {selectedJobs.length === 1 ? "Company" : "Companies"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
