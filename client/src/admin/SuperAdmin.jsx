import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  companiesAPI,
  jobsAPI,
  destinationsAPI,
  bookingsAPI,
} from "../services/api";
import api from "../services/api";
import {
  Building2,
  BadgeCheck,
  Briefcase,
  MapPin,
  CreditCard,
  Trash2,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Users,
  Activity,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export default function SuperAdmin() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "companies" | "jobs" | "destinations" | "bookings" | "system"
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Data states
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [engineStatus, setEngineStatus] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Add Destination Modal Form
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [destForm, setDestForm] = useState({
    title: "",
    country: "",
    city: "",
    pricePerPerson: 45000,
    durationDays: 5,
    category: "Popular",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
    description: "",
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [compRes, jobRes, destRes, bookRes, sysRes] = await Promise.allSettled([
        companiesAPI.getAll(),
        jobsAPI.getAll({ status: "All" }),
        destinationsAPI.getAll(),
        bookingsAPI.getAll(),
        api.get("/api/travel/status"),
      ]);

      if (compRes.status === "fulfilled") {
        setCompanies(compRes.value.data.companies || []);
      }
      if (jobRes.status === "fulfilled") {
        setJobs(jobRes.value.data.jobs || []);
      }
      if (destRes.status === "fulfilled") {
        setDestinations(destRes.value.data.destinations || destRes.value.data || []);
      }
      if (bookRes.status === "fulfilled") {
        setBookings(bookRes.value.data.bookings || []);
      }
      if (sysRes.status === "fulfilled") {
        setEngineStatus(sysRes.value.data.status || null);
      }
    } catch (err) {
      console.error("Failed loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3500);
  };

  // Toggle Company Verification
  const handleToggleVerify = async (id) => {
    try {
      const res = await companiesAPI.toggleVerify(id);
      setCompanies((prev) =>
        prev.map((c) => (c._id === id ? { ...c, verified: res.data.verified } : c))
      );
      showNotification(res.data.message || "Company verification updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to toggle verification");
    }
  };

  // Delete Job Opening
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to remove this job posting?")) return;
    try {
      await jobsAPI.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      showNotification("Job posting deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  // Delete Destination Package
  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Delete this destination tour package?")) return;
    try {
      await destinationsAPI.delete(id);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
      showNotification("Destination deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete destination");
    }
  };

  // Add Destination Package
  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      const res = await destinationsAPI.create({
        ...destForm,
        images: [destForm.image],
        highlights: ["Guided City Tour", "Airport Transfers Included", "Luxury Accommodation"],
      });
      if (res.data.success) {
        showNotification("Holiday destination package published!");
        setShowAddDestModal(false);
        loadAllData();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add destination");
    }
  };

  // Calculations
  const verifiedCompaniesCount = companies.filter((c) => c.verified).length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400 font-mono">Syncing enterprise metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Executive Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Master SuperAdmin Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global moderation of verified employers, jobs pipeline, travel packages & revenue
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadAllData}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowAddDestModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Holiday Package</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {msg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified Companies</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {companies.length}
            </span>
            <span className="text-[11px] font-bold text-emerald-400">
              ({verifiedCompaniesCount} verified)
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Multi-company hiring network</p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Live Job Postings</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {jobs.length}
            </span>
            <span className="text-[11px] font-bold text-purple-300">
              Active openings
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">1-Click batch apply enabled</p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Holiday Packages</span>
            <MapPin className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {destinations.length}
            </span>
            <span className="text-[11px] font-bold text-teal-300">
              Curated Tours
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Dubai, Bali, Swiss & more</p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Bookings Value</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{bookings.length} confirmed bookings</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-none">
        {[
          { id: "overview", label: "Executive Overview", icon: Activity },
          { id: "companies", label: `Companies (${companies.length})`, icon: Building2 },
          { id: "jobs", label: `Job Openings (${jobs.length})`, icon: Briefcase },
          { id: "destinations", label: `Destinations (${destinations.length})`, icon: MapPin },
          { id: "bookings", label: `Orders & Bookings (${bookings.length})`, icon: CreditCard },
          { id: "system", label: "Engine & Gateway Health", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Companies */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white">Registered Companies</h3>
              <button
                onClick={() => setActiveTab("companies")}
                className="text-xs text-purple-400 hover:underline"
              >
                Manage All →
              </button>
            </div>
            <div className="space-y-2.5">
              {companies.slice(0, 4).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        c.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D8ABC&color=fff`
                      }
                      alt={c.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{c.name}</span>
                        {c.verified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {c.industry} • {c.location}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleVerify(c._id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      c.verified
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                  >
                    {c.verified ? "Revoke" : "Verify"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white">Recent Customer Bookings</h3>
              <button
                onClick={() => setActiveTab("bookings")}
                className="text-xs text-purple-400 hover:underline"
              >
                View Orders →
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No bookings recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {bookings.slice(0, 4).map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{b.destinationTitle || "Holiday Package"}</p>
                      <p className="text-[11px] text-slate-500">
                        Ref: {b.orderId || b._id?.slice(-8)} • {b.checkIn}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{Number(b.amount)?.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-emerald-500 uppercase font-semibold">
                        {b.status || "CONFIRMED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMPANIES MODERATION */}
      {activeTab === "companies" && (
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white">Partner Companies Directory</h3>
              <p className="text-xs text-slate-400">
                Grant or revoke verified badges across the candidate hiring network
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company by name or industry..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Company Name</th>
                  <th className="p-3.5">Industry</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Openings</th>
                  <th className="p-3.5">Badge</th>
                  <th className="p-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {companies
                  .filter((c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((c) => (
                    <tr key={c._id} className="hover:bg-slate-900/50 transition">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                        <img
                          src={
                            c.logo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D8ABC&color=fff`
                          }
                          alt={c.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <Link
                          to={`/companies/${c.slug || c._id}`}
                          target="_blank"
                          className="hover:text-purple-400 hover:underline"
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="p-3.5">{c.industry}</td>
                      <td className="p-3.5">{c.location}</td>
                      <td className="p-3.5 font-bold text-purple-400">{c.jobsCount || 0}</td>
                      <td className="p-3.5">
                        {c.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            <BadgeCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleVerify(c._id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            c.verified
                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                              : "bg-blue-600 text-white hover:bg-blue-500"
                          }`}
                        >
                          {c.verified ? "Revoke Verification" : "Approve & Verify"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JOBS MODERATION */}
      {activeTab === "jobs" && (
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white">Global Job Openings Moderation</h3>
              <p className="text-xs text-slate-400">
                Inspect, review, or remove job postings across all registered companies
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Role Title</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Type / Location</th>
                  <th className="p-3.5">Salary Range</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3.5 font-bold text-white">
                      {job.title}
                    </td>
                    <td className="p-3.5 text-purple-300 font-semibold">
                      {job.company?.name || "Company"}
                    </td>
                    <td className="p-3.5">
                      {job.jobType} • {job.location}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400">
                      ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {job.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                        title="Delete Job Opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DESTINATIONS MANAGEMENT */}
      {activeTab === "destinations" && (
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white">Curated Holiday Destinations</h3>
              <p className="text-xs text-slate-400">
                Manage travel packages, hotel stays, itineraries and prices
              </p>
            </div>

            <button
              onClick={() => setShowAddDestModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Tour Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {destinations.map((d) => (
              <div
                key={d._id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 group"
              >
                <div>
                  <img
                    src={d.images?.[0] || d.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80"}
                    alt={d.title}
                    className="w-full h-36 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      {d.country}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-0.5 line-clamp-1">{d.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="font-black text-sm text-emerald-400">
                    ₹{(d.pricePerPerson || d.price)?.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/destinations/${d.slug || d._id}`}
                      target="_blank"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                      title="Preview Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteDestination(d._id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition cursor-pointer"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BOOKINGS & REVENUE */}
      {activeTab === "bookings" && (
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Customer Booking Orders</h3>
              <p className="text-xs text-slate-400">
                Real-time booking confirmations and payment reference logs
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Total: ₹{totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Destination Package</th>
                  <th className="p-3.5">Hotel Option</th>
                  <th className="p-3.5">Travel Dates</th>
                  <th className="p-3.5">Amount Paid</th>
                  <th className="p-3.5">Payment Ref</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/50 transition font-mono">
                    <td className="p-3.5 font-bold text-purple-300">
                      {b.orderId || b._id?.slice(-8)}
                    </td>
                    <td className="p-3.5 font-sans font-bold text-white">
                      {b.destinationTitle || "Custom Tour"}
                    </td>
                    <td className="p-3.5 font-sans text-slate-400">
                      {b.hotelName || "Selected Resort"}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {b.checkIn} → {b.checkOut}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      ₹{Number(b.amount)?.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-400">
                      {b.paymentId}
                    </td>
                    <td className="p-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {b.status || "CONFIRMED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SYSTEM & ENGINE HEALTH */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Amadeus Global GDS Engine</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Global flight ticketing and hotel schedule intelligence adapter.
            </p>

            <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-xs border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="text-white font-bold">{engineStatus?.provider || "Amadeus GDS"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Mode:</span>
                <span className="text-emerald-400 font-bold">{engineStatus?.mode || "Mock Adapter Engine"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Self-Service Status:</span>
                <span className="text-blue-400">Zero-Latency Fallback Active</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment Gateway Engine</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified Razorpay Cards, UPI, NetBanking + 1-Click Instant Demo Voucher engine.
            </p>

            <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-xs border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Gateway:</span>
                <span className="text-white font-bold">Razorpay Test & Live Rail</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency:</span>
                <span className="text-emerald-400 font-bold">INR (₹)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instant Demo Fallback:</span>
                <span className="text-emerald-400 font-bold">Enabled (Zero Failures)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD DESTINATION MODAL */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Add New Holiday Package</h3>
              <button
                onClick={() => setShowAddDestModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddDestination} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={destForm.title}
                  onChange={(e) => setDestForm({ ...destForm, title: e.target.value })}
                  placeholder="e.g. Tokyo & Mount Fuji Blossom Explorer"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={destForm.country}
                    onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                    placeholder="Japan"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={destForm.city}
                    onChange={(e) => setDestForm({ ...destForm, city: e.target.value })}
                    placeholder="Tokyo"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Price Per Person (₹)</label>
                  <input
                    type="number"
                    required
                    value={destForm.pricePerPerson}
                    onChange={(e) => setDestForm({ ...destForm, pricePerPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={destForm.durationDays}
                    onChange={(e) => setDestForm({ ...destForm, durationDays: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={destForm.image}
                  onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  placeholder="Highlights, sights, culture..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Publish Holiday Tour Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
