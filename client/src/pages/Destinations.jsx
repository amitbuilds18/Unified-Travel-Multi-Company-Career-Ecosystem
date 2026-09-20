import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { destinationsAPI } from "../services/api";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Compass,
  Filter,
  ArrowRight,
  Heart,
  Sparkles,
  CheckCircle2,
  Building2,
  BadgeCheck,
} from "lucide-react";
import FlightHotelSearch from "../components/FlightHotelSearch";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState("");
  const [wishlist, setWishlist] = useState(new Set());

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (country !== "All") params.country = country;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const res = await destinationsAPI.getAll(params);
      setDestinations(res.data.destinations || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tour destinations. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [category, country, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.2),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/10">
            <Compass className="w-3.5 h-3.5 text-teal-300" />
            <span>Curated Partner Destinations</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Explore Handcrafted <br />
            <span className="text-teal-300">Holiday Packages.</span>
          </h1>

          <p className="mt-3 text-teal-100/90 text-sm sm:text-base leading-relaxed">
            All-inclusive international itineraries curated by verified travel companies. Free cancellation, 5-star hotel options, and 24/7 on-ground assistance.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country, city, or tour title (e.g. Dubai, Bali, Swiss)..."
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm focus:outline-none shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold rounded-xl text-sm transition shadow-md shadow-teal-500/20 cursor-pointer whitespace-nowrap"
            >
              Search Packages
            </button>
          </form>
        </div>
      </div>

      {/* Amadeus Live Flight, Hotel & Activity Engine */}
      <FlightHotelSearch />

      {/* Categories & Filter Bar */}
      <div className="space-y-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-medium scrollbar-none">
          {[
            "All",
            "Asia",
            "Europe",
            "Middle-East",
            "Beach & Islands",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                category === cat
                  ? "bg-teal-700 text-white font-bold shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat === "All" ? "All Experiences" : cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-gray-200 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-gray-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
            >
              <option value="All">All Countries</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Indonesia">Indonesia (Bali)</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Maldives">Maldives</option>
              <option value="Thailand">Thailand</option>
            </select>

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={fetchDestinations}
              placeholder="Max Budget (₹)"
              className="w-32 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold outline-none"
            >
              <option value="featured">Featured / Best Matches</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Traveler Rating</option>
              <option value="duration">Trip Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 font-medium">Finding available holiday itineraries...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 my-8">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchDestinations}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && destinations.length === 0 && (
        <div className="p-16 text-center bg-gray-50 rounded-3xl border border-gray-200 my-6">
          <Compass className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Destination Packages Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setCountry("All");
              setMaxPrice("");
              fetchDestinations();
            }}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Destination Cards Grid */}
      {!loading && !error && destinations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => {
            const isWishlisted = wishlist.has(dest._id);
            const originalPrice = Math.round(
              dest.pricePerPerson * (1 + (dest.discountPercentage || 15) / 100)
            );

            return (
              <div
                key={dest._id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Photo with badges */}
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    src={
                      dest.images?.[0] ||
                      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient shadow on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {dest.badge && (
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-gray-900 text-[11px] font-bold rounded-lg shadow-sm">
                        {dest.badge}
                      </span>
                    )}
                    {dest.discountPercentage && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-md shadow-sm">
                        {dest.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => toggleWishlist(dest._id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-500 shadow-sm transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "text-red-500 fill-red-500" : ""
                      }`}
                    />
                  </button>

                  {/* Bottom Duration & Location Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-white/95 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <MapPin className="w-3.5 h-3.5 text-teal-300" />
                      {dest.city ? `${dest.city}, ` : ""}
                      {dest.country}
                    </span>

                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium">
                      {dest.durationDays}D / {dest.durationNights || dest.durationDays - 1}N
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating & Company Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{dest.ratings?.avg || 4.8}</span>
                        <span className="text-gray-400 font-normal">
                          ({dest.ratings?.count || 24})
                        </span>
                      </div>

                      {dest.company && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[120px]">{dest.company.name}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition leading-snug">
                      <Link to={`/destinations/${dest.slug || dest._id}`}>
                        {dest.title}
                      </Link>
                    </h2>

                    {/* Highlights Snippet */}
                    {dest.highlights && dest.highlights.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {dest.highlights.slice(0, 2).map((h, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-xs text-gray-600"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Price & Action */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        Starting from
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-gray-900">
                          ₹{dest.pricePerPerson?.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-teal-700 font-medium">
                        Per person • Taxes included
                      </span>
                    </div>

                    <Link
                      to={`/destinations/${dest.slug || dest._id}`}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 transition group-hover:translate-x-0.5"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
