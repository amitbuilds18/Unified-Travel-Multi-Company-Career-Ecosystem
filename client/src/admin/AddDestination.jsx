import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { destinationsAPI } from "../services/api";
import { ArrowLeft, Sparkles, PlusCircle } from "lucide-react";

export default function AddDestination() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    country: "",
    city: "",
    durationDays: 6,
    pricePerPerson: 49000,
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await destinationsAPI.create({
        ...data,
        images: [data.image],
        highlights: ["Premium 5-Star Accommodations", "Private Airport Chauffeur", "All Meals & Sightseeing Passes"],
      });
      if (res.data.success) {
        alert("Holiday Destination Package Published Successfully!");
        navigate("/admin/destinations");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/admin/destinations"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Packages
      </Link>

      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs text-purple-400 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Travel Publisher</span>
        </div>
        <h1 className="text-2xl font-black text-white">Create Holiday Tour Package</h1>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Publish dynamic itineraries and travel accommodation packages for global tourists
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Tour Package Title</label>
            <input
              type="text"
              required
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="e.g. Santorini & Mykonos Aegean Island Dream"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Country</label>
              <input
                type="text"
                required
                value={data.country}
                onChange={(e) => setData({ ...data, country: e.target.value })}
                placeholder="Greece"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">City / Region</label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                placeholder="Santorini"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Price / Person (₹)</label>
              <input
                type="number"
                required
                value={data.pricePerPerson}
                onChange={(e) => setData({ ...data, pricePerPerson: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Duration (Days)</label>
              <input
                type="number"
                value={data.durationDays}
                onChange={(e) => setData({ ...data, durationDays: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Category</label>
              <select
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
              >
                <option value="Popular">Popular</option>
                <option value="Luxury">Luxury</option>
                <option value="Adventure">Adventure</option>
                <option value="Honeymoon">Honeymoon</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
            <input
              type="url"
              value={data.image}
              onChange={(e) => setData({ ...data, image: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Outline what travelers will experience on this holiday..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? "Publishing Package..." : "Publish Destination Tour"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
