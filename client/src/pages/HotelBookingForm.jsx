import React, { useState } from "react";

export default function HotelBookingForm({ hotel, onClose }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  if (!hotel) return null;

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50">
      <button
        onClick={onClose}
        className="text-red-500 float-right font-semibold text-lg"
      >
        X
      </button>

      <h2 className="text-xl font-semibold mb-4">Book Hotel</h2>

      <p className="font-bold">{hotel.name}</p>
      <p className="text-gray-600">{hotel.city}</p>
      <p className="text-lg font-bold mt-2">₹{hotel.price}/night</p>

      <div className="mt-4">
        <label className="block mb-1">Check-in</label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1">Check-out</label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <button className="w-full mt-6 bg-blue-600 text-white p-3 rounded text-lg font-semibold">
        Confirm Booking
      </button>
    </div>
  );
}
