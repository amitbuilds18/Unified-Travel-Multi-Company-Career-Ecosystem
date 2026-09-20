import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Calendar,
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Receipt,
  ArrowRight,
} from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    api
      .get("/api/bookings/mine")
      .then((res) => {
        setBookings(res.data.bookings || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-teal-500/20 transition self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Trips</span>
        </Link>
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
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => {
            const dest = b.destinationId || {};

            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block md:text-right">
                      Total Paid
                    </span>
                    <span className="text-lg font-black text-teal-800">
                      ₹{b.amount?.toLocaleString()}
                    </span>
                  </div>

                  <span className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> E-Voucher Issued
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
