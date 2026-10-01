import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Building2,
  FileCheck2,
  LayoutDashboard,
  User,
  LogOut,
  Layers,
  Menu,
  X,
  Compass,
  Receipt,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const syncUser = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();
    // Listen for custom auth change events
    window.addEventListener("authChange", syncUser);
    return () => window.removeEventListener("authChange", syncUser);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MultiApply
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-md uppercase tracking-wider">
                Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/jobs"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/jobs")
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs & Openings</span>
            </Link>

            <Link
              to="/companies"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/companies")
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Companies</span>
            </Link>

            <Link
              to="/my-applications"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/my-applications")
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>My Applications</span>
            </Link>

            {/* Recruiter Dashboard Link */}
            <Link
              to="/recruiter"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/recruiter")
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Recruiter Portal</span>
            </Link>

            {/* Link to Destinations (preserving original travel feature) */}
            <Link
              to="/destinations"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/destinations")
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              title="Explore Partner Travel & Destinations"
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Travel</span>
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive("/my-bookings")
                    ? "bg-teal-50 text-teal-700 font-semibold"
                    : "text-gray-600 hover:text-teal-700 hover:bg-gray-50"
                }`}
                title="My Holiday Bookings & Vouchers"
              >
                <Receipt className="w-4 h-4 text-teal-600" />
                <span>My Bookings</span>
              </Link>
            )}
          </nav>

          {/* User Auth Action Area */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationCenter />

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-100 transition text-sm text-gray-700"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-xs leading-none text-gray-900 truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize leading-none mt-0.5">
                      {user.role === "company_admin" ? "Recruiter" : user.role || "Candidate"}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition shadow-blue-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & Mobile Notification */}
          <div className="flex md:hidden items-center gap-1.5">
            {user && <NotificationCenter />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Jobs & Openings
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Companies
            </Link>
            <Link
              to="/my-applications"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              My Applications
            </Link>
            <Link
              to="/recruiter"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Recruiter Portal
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-teal-600 hover:bg-teal-50"
            >
              Travel & Tours
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-teal-700 hover:bg-teal-50"
              >
                My Bookings & Vouchers
              </Link>
            )}

            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-1">
                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium bg-blue-600 text-white rounded-lg"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
