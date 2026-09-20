import React, { useState, useEffect } from "react";
import {
  Plane,
  Building2,
  Ticket,
  Search,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Luggage,
} from "lucide-react";
import api from "../services/api";

export default function FlightHotelSearch() {
  const [activeTab, setActiveTab] = useState("flights"); // "flights" | "hotels" | "activities"
  const [engineStatus, setEngineStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Flight search form
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("DXB");
  const [flightDate, setFlightDate] = useState("2026-10-15");
  const [flights, setFlights] = useState([]);

  // Hotel search form
  const [hotelCity, setHotelCity] = useState("Dubai");
  const [hotels, setHotels] = useState([]);

  // Activities form
  const [activityCity, setActivityCity] = useState("Dubai");
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Check Amadeus engine status
    api
      .get("/api/travel/status")
      .then((res) => setEngineStatus(res.data.status))
      .catch(() => {});

    // Initial search
    searchFlights();
  }, []);

  const searchFlights = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/travel/flights", {
        params: { origin, destination, departureDate: flightDate },
      });
      setFlights(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchHotels = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/travel/hotels", {
        params: { city: hotelCity },
      });
      setHotels(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchActivities = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/travel/activities", {
        params: { city: activityCity },
      });
      setActivities(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-12">
      {/* Header with Engine Status Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Global Travel Intelligence</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Live Flight & Hotel Finder
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Search real routes and rates powered by the Amadeus GDS engine
          </p>
        </div>

        {engineStatus && (
          <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <p className="font-bold text-white leading-none">{engineStatus.provider}</p>
              <p className="text-[10px] text-blue-200 leading-none mt-0.5">
                {engineStatus.mode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-2 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab("flights");
            if (flights.length === 0) searchFlights();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition cursor-pointer ${
            activeTab === "flights"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flight Offers</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("hotels");
            if (hotels.length === 0) searchHotels();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition cursor-pointer ${
            activeTab === "hotels"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotel Deals</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("activities");
            if (activities.length === 0) searchActivities();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition cursor-pointer ${
            activeTab === "activities"
              ? "bg-white text-teal-700 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Tours & Activities</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8">
        {/* 1. FLIGHTS TAB */}
        {activeTab === "flights" && (
          <div className="space-y-6">
            {/* Flight Search Form */}
            <form onSubmit={searchFlights} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  From (Airport Code)
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-gray-900 outline-none"
                >
                  <option value="DEL">Delhi (DEL)</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="BLR">Bengaluru (BLR)</option>
                  <option value="DXB">Dubai (DXB)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  To (Destination)
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-gray-900 outline-none"
                >
                  <option value="DXB">Dubai, UAE (DXB)</option>
                  <option value="DPS">Bali, Indonesia (DPS)</option>
                  <option value="ZRH">Zurich, Switzerland (ZRH)</option>
                  <option value="MLE">Malé, Maldives (MLE)</option>
                  <option value="HKT">Phuket, Thailand (HKT)</option>
                  <option value="SIN">Singapore (SIN)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Flights</span>
                </button>
              </div>
            </form>

            {/* Flight Results */}
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Searching global airline schedules...
              </div>
            ) : (
              <div className="space-y-3">
                {flights.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Airline & Timings */}
                    <div className="flex items-center gap-4">
                      <img
                        src={f.logo}
                        alt={f.airline}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{f.airline}</span>
                          <span className="text-[11px] font-mono text-gray-500">{f.flightNo}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                            {f.cabinClass}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                          <span className="font-bold text-gray-900 text-sm">{f.departureTime}</span>
                          <span className="text-gray-400">({origin})</span>
                          <span className="text-gray-300">───── {f.duration} ({f.stops}) ─────▶</span>
                          <span className="font-bold text-gray-900 text-sm">{f.arrivalTime}</span>
                          <span className="text-gray-400">({destination})</span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
                          <Luggage className="w-3.5 h-3.5 text-gray-400" />
                          <span>{f.baggage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block sm:text-right">
                          Per Traveler
                        </span>
                        <span className="text-xl font-black text-gray-900">
                          ₹{f.price?.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          alert(
                            `Flight ${f.flightNo} (${f.airline}) selected! Added to travel booking.`
                          )
                        }
                        className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
                      >
                        Select Flight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. HOTELS TAB */}
        {activeTab === "hotels" && (
          <div className="space-y-6">
            <form onSubmit={searchHotels} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  placeholder="Enter city (Dubai, Bali, Switzerland)..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                Find Hotels
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotels.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition flex gap-4"
                >
                  <img
                    src={h.image}
                    alt={h.name}
                    className="w-24 h-24 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-gray-900">{h.name}</h3>
                      <div className="flex items-center text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 font-bold">{h.guestRating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{h.address}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {h.amenities?.slice(0, 3).map((a, i) => (
                        <span
                          key={i}
                          className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium"
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700">
                        ₹{h.pricePerNight?.toLocaleString()} / night
                      </span>
                      <button
                        onClick={() => alert(`Selected ${h.name}`)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-700 rounded-lg text-[11px] font-semibold transition"
                      >
                        Book Room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TOURS & ACTIVITIES TAB */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition flex gap-4"
                >
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-24 h-24 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-900 leading-snug">{a.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> {a.duration}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {a.tags?.map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800">
                        ₹{a.price?.toLocaleString()}
                      </span>
                      <button
                        onClick={() => alert(`Activity "${a.name}" added to itinerary!`)}
                        className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-[11px] font-semibold hover:bg-teal-700 transition"
                      >
                        Add Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
