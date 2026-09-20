import React from "react";
import { Link } from "react-router-dom";
import { Layers, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 text-xs">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-gray-900">MultiApply Pro</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Empowering candidates to discover opportunities and apply across multiple verified companies in a single click.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">For Candidates</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="hover:text-blue-600 transition">
                  Browse All Openings
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-600 transition">
                  Explore Companies
                </Link>
              </li>
              <li>
                <Link to="/my-applications" className="hover:text-blue-600 transition">
                  Application Status Tracker
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-600 transition">
                  My Profile & Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">For Employers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/recruiter" className="hover:text-blue-600 transition">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600 transition">
                  Register Company Profile
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-blue-600 transition">
                  Recruiter Sign In
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-blue-600 transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel & Partner Modules */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-3">Travel Partners</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/destinations" className="hover:text-blue-600 transition">
                  Curated Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-blue-600 transition">
                  Travel Bookings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400">
          <p>© {new Date().getFullYear()} MultiApply Pro. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Built with modern MERN Stack &</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}