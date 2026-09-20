import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowLeft,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!state) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h2 className="text-xl font-bold text-gray-800">No Booking Details Selected</h2>
        <p className="text-sm text-gray-500 mt-2">Please select a destination package to start checkout.</p>
        <Link
          to="/destinations"
          className="mt-5 inline-block px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Destinations
        </Link>
      </div>
    );
  }

  const {
    destination,
    hotel,
    checkIn,
    checkOut,
    nights,
    guests = 2,
    totalPrice,
    city,
    propertyName,
  } = state;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Razorpay Gateway Payment
  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: totalPrice,
      });

      const { order, keyId } = res.data;

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: keyId || "rzp_test_ABC123XYZ456",
        amount: order.amount,
        currency: "INR",
        name: "Travel Booking",
        description: destination.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  destinationId: destination._id,
                  destinationTitle: destination.title,
                  hotelName: hotel?.name || "Standard Accommodations",
                  checkIn,
                  checkOut,
                  amount: totalPrice,
                },
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );

            if (verifyRes.data.success) {
              setConfirmedBooking(verifyRes.data.booking);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification error");
          }
        },
        prefill: {
          name: user.name || "Guest Traveler",
          email: user.email || "traveler@example.com",
          contact: user.phone || "9876543210",
        },
        theme: {
          color: "#0d9488",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.warn("Razorpay order creation fallback:", error);
      // Offer demo instant booking
      if (
        window.confirm(
          "Razorpay test keys are in mock mode. Would you like to complete this with 1-Click Instant Demo Booking?"
        )
      ) {
        handleInstantBooking();
      }
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Booking (Guaranteed to work without needing live bank account)
  const handleInstantBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/instant-booking",
        {
          bookingData: {
            destinationId: destination._id,
            destinationTitle: destination.title,
            hotelName: hotel?.name || "Standard Accommodations",
            checkIn,
            checkOut,
            amount: totalPrice,
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setConfirmedBooking(res.data.booking);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success Confirmation Screen
  if (confirmedBooking) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Booking Confirmed!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              Pack Your Bags! ✈️
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Your holiday package for <strong>{destination.title}</strong> is confirmed. A receipt and travel voucher has been generated.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl text-left text-xs space-y-2 border border-gray-100 font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Booking Ref:</span>
              <span className="font-bold text-gray-900">{confirmedBooking.orderId || confirmedBooking._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Ref:</span>
              <span className="text-emerald-700 font-bold">{confirmedBooking.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dates:</span>
              <span className="text-gray-900">{checkIn} → {checkOut}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-500">Total Paid:</span>
              <span className="font-bold text-gray-900 text-sm">₹{totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/my-bookings"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition"
            >
              View My Bookings
            </Link>
            <Link
              to="/destinations"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
            >
              Explore More Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl pb-24">
      {/* Back Link */}
      <Link
        to={`/destinations/${destination.slug || destination._id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-700 transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Details
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 p-6 sm:p-8 text-white">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
            Secure Booking & Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Confirm Your Holiday Package
          </h1>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Trip Summary Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <img
              src={
                destination.images?.[0] ||
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80"
              }
              alt={destination.title}
              className="w-24 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-bold text-base text-gray-900">{destination.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 inline text-teal-600 mr-1" />
                {city}, {destination.country}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {checkIn} to {checkOut} ({nights} Nights)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  {guests} Travelers
                </span>
              </div>
            </div>
          </div>

          {/* Hotel Details */}
          {hotel && (
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span className="font-bold text-gray-900">{hotel.name}</span>
                </div>
                <span className="font-bold text-teal-800">₹{hotel.price} / night</span>
              </div>
              <p className="text-gray-500 mt-1">{hotel.city}</p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Base Tour Package ({guests} Guests)</span>
              <span>₹{(destination.pricePerPerson * guests).toLocaleString()}</span>
            </div>
            {hotel && (
              <div className="flex justify-between">
                <span>Hotel Upgrade ({nights} Nights)</span>
                <span>+₹{(hotel.price * nights).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>GST & Tourism Taxes</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between font-black text-gray-900 text-base pt-3 border-t">
              <span>Total Payable Amount</span>
              <span className="text-teal-700">₹{totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <button
              onClick={handleInstantBooking}
              disabled={loading}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Confirm & Book Holiday (Instant Confirmation)</span>
                </>
              )}
            </button>

            <button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl text-xs border border-gray-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span>Pay via Razorpay Cards / UPI / NetBanking</span>
            </button>
          </div>

          {/* Security Reassurance */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit encrypted checkout • Free cancellation up to 48h prior</span>
          </div>
        </div>
      </div>
    </div>
  );
}
