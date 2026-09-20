import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2, User, Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Notify header and app of auth state change
      window.dispatchEvent(new Event("authChange"));

      if (user.role === "company_admin") {
        navigate("/recruiter");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setForm({ email, password });
    setLoading(true);
    authAPI
      .login({ email, password })
      .then((res) => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("authChange"));
        if (user.role === "company_admin") {
          navigate("/recruiter");
        } else if (user.role === "admin" || user.role === "superadmin") {
          navigate("/admin/superadmin");
        } else {
          navigate("/jobs");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Demo login failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Log in to manage applications and explore multi-company opportunities
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3.5 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick 1-Click Demo Login:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin("candidate@demo.com", "password123")}
              disabled={loading}
              className="flex items-center justify-center gap-1 py-2 px-1.5 bg-white hover:bg-blue-600 hover:text-white text-gray-700 text-xs font-medium rounded-lg border border-blue-200 shadow-sm transition group cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-500 group-hover:text-white shrink-0" />
              <span>Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("recruiter.tech@company.com", "password123")}
              disabled={loading}
              className="flex items-center justify-center gap-1 py-2 px-1.5 bg-white hover:bg-indigo-600 hover:text-white text-gray-700 text-xs font-medium rounded-lg border border-indigo-200 shadow-sm transition group cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500 group-hover:text-white shrink-0" />
              <span>Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin@platform.com", "password123")}
              disabled={loading}
              className="flex items-center justify-center gap-1 py-2 px-1.5 bg-white hover:bg-purple-700 hover:text-white text-gray-700 text-xs font-medium rounded-lg border border-purple-200 shadow-sm transition group cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600 group-hover:text-white shrink-0" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-7 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit encrypted authentication & verified companies</span>
        </div>
      </div>
    </div>
  );
}
