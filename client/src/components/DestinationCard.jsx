import React from "react";
import { Link } from "react-router-dom";

export default function DestinationCard({ dest }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <img
        src={dest?.images?.[0] ?? "/placeholder.jpg"}
        alt={dest?.title}
        className="w-full h-44 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{dest?.title}</h3>
        <p className="text-sm text-gray-600">
          {dest?.city ? `${dest.city}, ` : ""}
          {dest?.country || "Unknown"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">
            ₹{(dest?.pricePerPerson ?? dest?.price)?.toLocaleString()}
          </div>

          <Link
            to={`/destination/${dest.slug}`}
            className="text-sm px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
