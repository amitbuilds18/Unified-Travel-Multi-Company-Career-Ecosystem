import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { destinationsAPI } from "../services/api";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Building2,
  BadgeCheck,
  ArrowLeft,
  Share2,
  Heart,
  ChevronDown,
  Sparkles,
  CreditCard,
  MessageSquare,
  Send,
} from "lucide-react";

export default function DestinationDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Widget State
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "itinerary" | "hotels" | "reviews"
  const [expandedDay, setExpandedDay] = useState(1);
  const [copied, setCopied] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.name) setReviewAuthor(u.name);
    } catch {}
  }, []);

  useEffect(() => {
    // Set default dates: 14 days from now
    const today = new Date();
    const defaultIn = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const inStr = defaultIn.toISOString().split("T")[0];
    setCheckIn(inStr);

    setLoading(true);
    setError(null);

    destinationsAPI
      .getBySlug(slug)
      .then((res) => {
        const d = res.data.destination || res.data;
        setDest(d);
        if (d.hotels && d.hotels.length > 0) {
          setSelectedHotel(d.hotels[0]);
        }

        // Set checkout based on trip duration
        const duration = d.durationDays || 5;
        const defaultOut = new Date(
          defaultIn.getTime() + (duration - 1) * 24 * 60 * 60 * 1000
        );
        setCheckOut(defaultOut.toISOString().split("T")[0]);
      })
      .catch((err) => {
        console.error(err);
        setError("Destination package not found or failed to load.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return (dest?.durationDays || 5) - 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : (dest?.durationDays || 5) - 1;
  };

  const calculateTotal = () => {
    if (!dest) return 0;
    const basePerPerson = dest.pricePerPerson || dest.price || 0;
    const baseTotal = basePerPerson * guests;
    const nights = calculateNights();
    const hotelCost = selectedHotel ? selectedHotel.price * nights : 0;
    return baseTotal + hotelCost;
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Please choose travel dates.");
      return;
    }

    const nights = calculateNights();
    const total = calculateTotal();

    navigate("/checkout", {
      state: {
        destination: dest,
        hotel: selectedHotel,
        checkIn,
        checkOut,
        nights,
        guests,
        totalPrice: total,
        city: dest.city || dest.country,
        propertyName: selectedHotel ? selectedHotel.name : dest.title,
      },
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError("Please write a few words about your trip experience.");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const author = reviewAuthor.trim() || storedUser.name || "Verified Traveler";

      const res = await destinationsAPI.addReview(dest._id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
        user: { name: author, email: storedUser.email || "" },
      });

      const newReview = res.data.review || {
        user: { name: author },
        rating: reviewRating,
        comment: reviewComment.trim(),
        createdAt: new Date().toISOString(),
      };

      setDest((prev) => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])],
        ratings: res.data.ratings || {
          avg: Number(
            (
              ((prev.ratings?.avg || 4.8) * (prev.ratings?.count || 1) + reviewRating) /
              ((prev.ratings?.count || 1) + 1)
            ).toFixed(1)
          ),
          count: (prev.ratings?.count || 0) + 1,
        },
      }));

      setReviewComment("");
      setReviewSuccess("Thank you! Your travel review has been submitted successfully.");
      setShowReviewForm(false);
      setTimeout(() => setReviewSuccess(""), 4500);
    } catch (err) {
      console.error(err);
      setReviewError(
        err.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2 font-medium">Loading destination experience...</p>
      </div>
    );
  }

  if (error || !dest) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-red-700">
          <p className="font-bold">{error || "Destination not found"}</p>
          <Link
            to="/destinations"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    country,
    city,
    pricePerPerson,
    durationDays,
    durationNights = durationDays - 1,
    images = [],
    description,
    highlights = [],
    inclusions = [],
    itinerary = [],
    hotels = [],
    ratings = {},
    reviews = [],
    badge,
    company,
  } = dest;

  const originalPrice = Math.round(pricePerPerson * 1.2);
  const nights = calculateNights();
  const totalPrice = calculateTotal();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Destinations
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-medium shadow-xs transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Destination Title & Header Row */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {badge && (
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-md border border-teal-200">
              {badge}
            </span>
          )}
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            {city ? `${city}, ` : ""}
            {country}
          </span>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{ratings.avg || 4.9}</span>
            <span className="text-gray-400 font-normal">({ratings.count || 24} reviews)</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>

        {company && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
            <span>Organized & Hosted by</span>
            <Link
              to={`/companies/${company.slug || company._id}`}
              className="font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>{company.name}</span>
              {company.verified && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
              )}
            </Link>
          </div>
        )}
      </div>

      {/* High-Resolution Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden mb-10 h-[380px] sm:h-[440px]">
        {/* Main Large Image */}
        <div className="md:col-span-2 h-full overflow-hidden bg-gray-100">
          <img
            src={images[0] || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right 2 Side Images */}
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          <div className="overflow-hidden bg-gray-100 rounded-tr-3xl">
            <img
              src={images[1] || images[0]}
              alt={`${title}-2`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="overflow-hidden bg-gray-100 rounded-br-3xl">
            <img
              src={images[2] || images[0]}
              alt={`${title}-3`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Content (Left 2 cols) + Sticky Booking Card (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Trip Info Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-teal-50/50 rounded-2xl border border-teal-100 text-xs">
            <div>
              <p className="text-gray-400 font-medium">Duration</p>
              <p className="text-gray-900 font-bold mt-0.5">
                {durationDays} Days / {durationNights} Nights
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Tour Type</p>
              <p className="text-gray-900 font-bold mt-0.5">Guided Package</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Group Size</p>
              <p className="text-gray-900 font-bold mt-0.5">Max 12 Guests</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Confirmation</p>
              <p className="text-teal-800 font-bold mt-0.5">Instant Booking</p>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-3 text-sm font-bold">
            {[
              { id: "overview", label: "Overview" },
              { id: "itinerary", label: "Day-by-Day Itinerary" },
              { id: "hotels", label: `Hotels (${hotels.length})` },
              { id: "reviews", label: `Reviews (${reviews.length || ratings.count || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-1 transition cursor-pointer ${
                  activeTab === tab.id
                    ? "text-teal-700 border-b-2 border-teal-700"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & HIGHLIGHTS */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Experience</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>

              {highlights.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Trip Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inclusions.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">What's Included</h3>
                  <div className="space-y-2">
                    {inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ITINERARY */}
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Detailed {durationDays}-Day Schedule
              </h2>
              {itinerary.map((day, idx) => {
                const dayNum = day.day || idx + 1;
                const isExpanded = expandedDay === dayNum;

                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : dayNum)}
                      className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          D{dayNum}
                        </div>
                        <span className="font-bold text-sm text-gray-900">
                          {day.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isExpanded ? "rotate-180 text-teal-600" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-1 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                        <p>{day.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: HOTELS */}
          {activeTab === "hotels" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Included Accommodations
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Select your preferred hotel stay. Upgrades calculate automatically into your checkout total.
              </p>

              <div className="space-y-4">
                {hotels.map((hotel, idx) => {
                  const isSelected = selectedHotel?.name === hotel.name;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedHotel(hotel)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isSelected
                          ? "border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/20"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"}
                          alt={hotel.name}
                          className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm text-gray-900">{hotel.name}</h3>
                            <div className="flex items-center text-amber-500 text-xs">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span className="ml-0.5 font-bold">{hotel.rating || 4.8}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{hotel.city}</p>

                          {hotel.amenities && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {hotel.amenities.map((a, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{hotel.price?.toLocaleString()} / night
                        </span>
                        <span
                          className={`mt-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            isSelected
                              ? "bg-teal-700 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {isSelected ? "✓ Selected" : "Select Room"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Header & Write Review Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
                    {ratings.avg || 4.9}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(ratings.avg || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-bold text-gray-900 text-sm">
                        {ratings.avg >= 4.5 ? "Exceptional" : "Very Good"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Based on {ratings.count || reviews.length || 24} verified traveler experiences
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{showReviewForm ? "Close Form" : "Write a Review"}</span>
                </button>
              </div>

              {/* Review Success Banner */}
              {reviewSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {/* Interactive Write Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-6 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" /> Share Your Holiday Experience
                    </h3>
                    <span className="text-xs text-gray-400">Verified Traveler Review</span>
                  </div>

                  {reviewError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                      {reviewError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Rate Your Experience (1 - 5 Stars)
                      </label>
                      <div className="flex items-center gap-1 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-gray-600">
                          {reviewRating === 5 && "5 - Exceptional"}
                          {reviewRating === 4 && "4 - Very Good"}
                          {reviewRating === 3 && "3 - Average"}
                          {reviewRating === 2 && "2 - Poor"}
                          {reviewRating === 1 && "1 - Terrible"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Review & Trip Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tell future travelers about your experience — sights, hotel comfort, meals, tour guide, and key highlights..."
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 resize-none bg-white"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{reviewSubmitting ? "Submitting..." : "Submit Review"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl text-xs text-gray-500 border border-dashed border-gray-200">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700">No written reviews yet</p>
                  <p className="text-gray-400 mt-0.5">
                    Be the first traveler to share feedback on this trip package!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev, i) => {
                    const reviewerName =
                      typeof rev.user === "object"
                        ? rev.user?.name || "Traveler"
                        : rev.user || "Traveler";
                    const initial = reviewerName.charAt(0).toUpperCase();

                    return (
                      <div
                        key={i}
                        className="p-4 bg-white rounded-2xl border border-gray-200 text-xs shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                              {initial}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{reviewerName}</span>
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-100">
                                  Verified
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {rev.createdAt
                                  ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Recent Traveler"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-amber-500 gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (rev.rating || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-700 text-xs leading-relaxed pl-10">
                          {rev.comment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Column: Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-gray-200 shadow-xl space-y-5">
            {/* Price Header */}
            <div>
              <span className="text-xs text-gray-400 uppercase font-semibold">Special Package Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-gray-900">
                  ₹{pricePerPerson?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  SAVE 20%
                </span>
              </div>
              <p className="text-xs text-teal-700 font-medium mt-0.5">
                Per person • {durationDays} Days / {durationNights} Nights
              </p>
            </div>

            {/* Travel Dates Picker */}
            <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Number of Travelers</label>
                <div className="flex items-center justify-between p-2 border rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-800">{guests} Adults</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="pt-3 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
              <div className="flex justify-between">
                <span>Base Tour (₹{pricePerPerson} × {guests})</span>
                <span>₹{(pricePerPerson * guests).toLocaleString()}</span>
              </div>
              {selectedHotel && (
                <div className="flex justify-between text-teal-800">
                  <span>Hotel: {selectedHotel.name} ({nights}n)</span>
                  <span>+₹{(selectedHotel.price * nights).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t text-sm">
                <span>Total Estimated</span>
                <span className="text-teal-700">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-teal-600/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </button>

            {/* Reassurance Badges */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure Razorpay Payment Gateway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Free cancellation up to 48 hours prior</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
