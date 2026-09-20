import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { destinationsAPI } from "../services/api";
import { MapPin, Trash2, PlusCircle, ExternalLink, Calendar } from "lucide-react";

export default function DestinationList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDest = async () => {
    setLoading(true);
    try {
      const res = await destinationsAPI.getAll();
      setItems(res.data.destinations || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDest();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await destinationsAPI.delete(id);
      setItems((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete destination");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">All Tour Packages</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage curated holiday itineraries & pricing</p>
        </div>

        <Link
          to="/admin/add-destination"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-purple-600/20"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Package</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading tour packages...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div
              key={d._id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4"
            >
              <div>
                <img
                  src={d.images?.[0] || d.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80"}
                  alt={d.title}
                  className="w-full h-40 object-cover rounded-xl border border-slate-700"
                />
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {d.country}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1 line-clamp-1">{d.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="font-black text-sm text-emerald-400">
                  ₹{(d.pricePerPerson || d.price)?.toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/destinations/${d.slug || d._id}`}
                    target="_blank"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    title="View public page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(d._id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition cursor-pointer"
                    title="Delete package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
