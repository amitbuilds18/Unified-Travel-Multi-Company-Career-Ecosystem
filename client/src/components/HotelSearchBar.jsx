import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HotelSearchBar() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    navigate("/hotels", {
      state: {
        city,
        checkIn,
        checkOut,
        rooms,
        guests
      },
    });
  };

  return (
    <div className="w-full bg-white p-6 shadow-lg rounded-xl mt-10">
      <h2 className="text-xl font-semibold mb-4">Search Hotels</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* City */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            City / Property Name
          </label>
          <input
            type="text"
            placeholder="Goa, Delhi, Hotel Name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Check-in */}
        <div>
          <label className="text-sm font-medium text-gray-600">Check-In</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="text-sm font-medium text-gray-600">Check-Out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Rooms & Guests */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Rooms & Guests
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              min="1"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            SEARCH
          </button>
        </div>

      </div>
    </div>
  );
}
