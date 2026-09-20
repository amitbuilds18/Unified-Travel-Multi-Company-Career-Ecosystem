import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Multi-Company Portal Pages
import Home from "./pages/Home";
import JobsList from "./pages/JobsList";
import CompaniesList from "./pages/CompaniesList";
import CompanyDetail from "./pages/CompanyDetail";
import MyApplications from "./pages/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Travel Pages
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";

// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AddDestination from "./admin/AddDestination";
import DestinationList from "./admin/DestinationList";
import SuperAdmin from "./admin/SuperAdmin";

/* USER AUTH GUARD */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

/* ADMIN AUTH GUARD */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  let allowed = false;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      allowed = decoded.role === "admin" || decoded.role === "superadmin";
    } catch {
      allowed = false;
    }
  }

  return allowed ? children : <Navigate to="/admin-login" />;
};

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-gray-900 selection:bg-blue-500 selection:text-white">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* MULTI-COMPANY APPLICATION PORTAL ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/companies/:idOrSlug" element={<CompanyDetail />} />

          <Route
            path="/my-applications"
            element={
              <PrivateRoute>
                <MyApplications />
              </PrivateRoute>
            }
          />

          <Route
            path="/recruiter"
            element={
              <PrivateRoute>
                <RecruiterDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* AUTHENTICATION ROUTES */}
          <Route path="/auth" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* TRAVEL & TOUR PACKAGES ROUTES */}
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />

          {/* ADMIN & SUPERADMIN ROUTES */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="add-destination" element={<AddDestination />} />
            <Route path="destinations" element={<DestinationList />} />
            <Route path="superadmin" element={<SuperAdmin />} />
          </Route>

          {/* 404 CATCH-ALL */}
          <Route
            path="*"
            element={
              <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-black text-gray-900">404</h1>
                <p className="text-gray-500 mt-2 text-sm">The page you requested could not be found.</p>
                <a
                  href="/"
                  className="mt-5 inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Return Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
