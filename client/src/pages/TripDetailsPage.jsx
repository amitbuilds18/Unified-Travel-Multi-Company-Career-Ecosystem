import React, { useState, useEffect } from "react";
import HotelsList from "./HotelsList";
import HotelBookingForm from "./HotelBookingForm";

export default function TripDetailsPage({ trip }) {
  const [selectedHotel, setSelectedHotel] = useState(null);

  return (
    <div className="relative">

      {/* Main Content */}
      <div className="p-6 max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
        <p className="text-gray-600">{trip.country}, {trip.city}</p>

        {/* Description */}
        <p className="mt-4">{trip.description}</p>

        {/* Highlights */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Highlights</h2>
        <div className="flex gap-3">
          {trip.highlights.map((hl, idx) => (
            <span key={idx} className="px-3 py-1 border rounded bg-gray-100">
              {hl}
            </span>
          ))}
        </div>

        {/* Itinerary */}
        <h2 className="text-xl font-semibold mt-6 mb-3">Itinerary</h2>
        <div className="space-y-4">
          {trip.itinerary.map((item, idx) => (
            <div key={idx} className="border rounded p-4 bg-white">
              <h3 className="font-bold">Day {idx + 1}: {item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Hotels */}
        <HotelsList
          hotels={trip.hotels}
          onBookHotel={(hotel) => setSelectedHotel(hotel)}
        />
      </div>

      {/* RIGHT-SIDE HOTEL BOOKING PANEL */}
      {selectedHotel && (
        <HotelBookingForm
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      )}
    </div>
  );
}
