import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookingsAPI } from "../services/api";
import {
  Calendar,
  Compass,
  CheckCircle2,
  XCircle,
  Building2,
  Receipt,
  ArrowRight,
  Printer,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  AlertTriangle,
} from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "CONFIRMED" | "CANCELLED"
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(u);
    } catch {}

    bookingsAPI
      .getMy()
      .then((res) => {
        setBookings(res.data.bookings || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? A 100% refund will be initiated to your original payment method."
      )
    ) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await bookingsAPI.cancel(bookingId);
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
        alert(
          "Your holiday booking has been cancelled. Refund initiated to your original payment method."
        );
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to cancel booking. Please try again or contact support."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const st = (b.status || "CONFIRMED").toUpperCase();
    if (statusFilter === "ALL") return true;
    if (statusFilter === "CONFIRMED") return st === "CONFIRMED";
    if (statusFilter === "CANCELLED") return st === "CANCELLED";
    return true;
  });

  const confirmedCount = bookings.filter(
    (b) => (b.status || "CONFIRMED").toUpperCase() === "CONFIRMED"
  ).length;
  const cancelledCount = bookings.filter(
    (b) => (b.status || "").toUpperCase() === "CANCELLED"
  ).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
            Travel Center
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-2">
            My Holiday Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access your trip vouchers, itineraries, and payment receipts
          </p>
        </div>

        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-teal-500/20 transition self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Trips</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "CONFIRMED"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Confirmed ({confirmedCount})
        </button>

        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "CANCELLED"
              ? "bg-red-600 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading your holiday bookings...</p>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 shadow-xs max-w-xl mx-auto my-8">
          <Compass className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Bookings Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            You haven't reserved any vacation packages yet. Browse our curated international destinations!
          </p>
          <Link
            to="/destinations"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition cursor-pointer"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
          No bookings matching status filter "{statusFilter}".
        </div>
      )}

      {!loading && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const dest = b.destinationId || {};
            const isCancelled = (b.status || "").toUpperCase() === "CANCELLED";

            return (
              <div
                key={b._id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs hover:shadow-md ${
                  isCancelled
                    ? "border-gray-200 opacity-75"
                    : "border-gray-200 hover:border-teal-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      dest.images?.[0] ||
                      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={b.destinationTitle || "Destination"}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-base text-gray-900">
                        {b.destinationTitle || dest.title || "Holiday Package"}
                      </h2>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCancelled
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        ● {b.status || "CONFIRMED"}
                      </span>
                    </div>

                    {b.hotelName && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        Hotel: {b.hotelName}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {b.checkIn} → {b.checkOut}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-gray-400">
                        Ref: {b.paymentId || b._id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div className="md:text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                      Total Paid
                    </span>
                    <span
                      className={`text-lg font-black ${
                        isCancelled ? "text-gray-400 line-through" : "text-teal-800"
                      }`}
                    >
                      ₹{b.amount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveVoucher(b)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Receipt className="w-3.5 h-3.5 text-teal-600" />
                      <span>View Voucher</span>
                    </button>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 border border-gray-200 hover:border-red-200 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === b._id ? "Cancelling..." : "Cancel Trip"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRAVEL VOUCHER MODAL */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-gray-200">
            {/* Modal Controls Top Bar */}
            <div className="bg-gray-900 text-white p-4 px-6 flex items-center justify-between print:hidden">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Receipt className="w-4 h-4" /> Official Travel Voucher
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVoucher(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Voucher Body */}
            <div className="p-6 sm:p-8 space-y-6 print:p-8" id="voucher-printable-area">
              {/* Voucher Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-gray-900 tracking-tight">
                      VOYAGE<span className="text-teal-600">TRAVEL</span>
                    </span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                      E-TICKET / VOUCHER
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Unified Multi-Company & Holiday Ecosystem
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-gray-500 space-y-0.5">
                  <p>
                    <strong className="text-gray-800">Booking Ref:</strong>{" "}
                    {activeVoucher.orderId || activeVoucher._id}
                  </p>
                  <p>
                    <strong className="text-gray-800">Issue Date:</strong>{" "}
                    {new Date(activeVoucher.createdAt || Date.now()).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-emerald-700 font-bold">
                    Status: {activeVoucher.status || "CONFIRMED"}
                  </p>
                </div>
              </div>

              {/* Primary Traveler Information */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                <span className="font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Primary Traveler Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block">Traveler Name</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {user.name || "Valued Traveler"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Registered Email</span>
                    <span className="font-semibold text-gray-800">
                      {user.email || "traveler@platform.com"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Contact Number</span>
                    <span className="font-semibold text-gray-800">
                      {user.phone || "+91 98765 43210"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tour & Accommodations Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider border-b pb-1">
                  Trip & Itinerary Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                    <span className="text-gray-400 font-semibold uppercase block text-[10px]">
                      Package Destination
                    </span>
                    <h4 className="text-base font-black text-gray-900 mt-1">
                      {activeVoucher.destinationTitle ||
                        activeVoucher.destinationId?.title ||
                        "International Holiday"}
                    </h4>
                    <p className="text-teal-700 font-medium mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeVoucher.destinationId?.country || "Global Destination"}
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                    <span className="text-gray-400 font-semibold uppercase block text-[10px]">
                      Selected Accommodation
                    </span>
                    <h4 className="text-base font-black text-gray-900 mt-1">
                      {activeVoucher.hotelName || "Standard Luxury Suite"}
                    </h4>
                    <p className="text-gray-600 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      Complimentary Breakfast & Transfers
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block">Check-in</span>
                    <span className="font-bold text-gray-900">{activeVoucher.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Check-out</span>
                    <span className="font-bold text-gray-900">{activeVoucher.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Guests</span>
                    <span className="font-bold text-gray-900">2 Travelers</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Payment Method</span>
                    <span className="font-bold text-emerald-700">Online Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Payment Receipt Table */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">
                          {activeVoucher.destinationTitle || "Holiday Experience"} Base Package
                        </div>
                        <span className="text-[10px] text-gray-400">
                          Includes guided sightseeing, transfers & stays
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">
                        ₹{activeVoucher.amount?.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-600">Goods & Services Tax (GST 5%)</td>
                      <td className="p-3 text-right text-gray-600">Included</td>
                    </tr>
                    <tr className="bg-teal-50/50 font-bold text-sm">
                      <td className="p-3 text-gray-900">Total Amount Paid</td>
                      <td className="p-3 text-right text-teal-800 font-black">
                        ₹{activeVoucher.amount?.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Voucher Footer Instructions */}
              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                <p className="font-bold text-gray-700">Important Instructions:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Please present this voucher alongside a valid government-issued photo ID upon check-in.</li>
                  <li>Standard hotel check-in is 2:00 PM and check-out is 11:00 AM local time.</li>
                  <li>For 24/7 concierge trip assistance or flight coordinate changes, call support at +91 1800-419-8765.</li>
                </ul>
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="bg-gray-50 p-4 px-6 border-t border-gray-100 flex justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setActiveVoucher(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
