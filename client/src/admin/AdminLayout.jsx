import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Shield,
  Building2,
  Briefcase,
  MapPin,
  CreditCard,
  Globe,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    navigate("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sleek Sidebar */}
      <aside className="w-64 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo & Suite Badge */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
                <span>Traval</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Admin
                </span>
              </span>
              <p className="text-[11px] text-slate-400">Master Control Suite</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5 text-xs font-semibold">
            <NavLink
              to="/admin/superadmin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Master Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/destinations"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <MapPin className="w-4 h-4" />
              <span>Holiday Destinations</span>
            </NavLink>

            <NavLink
              to="/admin/add-destination"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Destination</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer Area */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          {/* Admin Info Pill */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
              SA
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">
                {user.name || "Super Administrator"}
              </p>
              <p className="text-[10px] text-purple-400 font-mono truncate">
                {user.email || "admin@platform.com"}
              </p>
            </div>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
