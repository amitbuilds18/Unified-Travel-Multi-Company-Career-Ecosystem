import React, { useState } from "react";

const destinations = [
  {
    id: 1,
    name: "Dubai Premium Tour",
    country: "UAE",
    price: 45000,
    image: "https://source.unsplash.com/800x600/?dubai",
    days: 5,
  },
  {
    id: 2,
    name: "Bali Island Escape",
    country: "Indonesia",
    price: 38500,
    image: "https://source.unsplash.com/800x600/?bali",
    days: 6,
  },
  {
    id: 3,
    name: "Thailand Adventure",
    country: "Thailand",
    price: 40000,
    image: "https://source.unsplash.com/800x600/?thailand",
    days: 7,
  },
];

const DestinationsPage = () => {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [country, setCountry] = useState("");

  // FILTER LOGIC
  const filteredDestinations = destinations.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (country ? item.country === country : true) &&
      (maxPrice ? item.price <= maxPrice : true)
    );
  });

  return (
    <div className="min-h-screen px-6 py-6">
      <h1 className="text-4xl font-bold mb-6">All Destinations</h1>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row gap-4">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search destination..."
          className="border px-4 py-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Country Filter */}
        <select
          className="border px-4 py-2 rounded w-full"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Filter by Country</option>
          <option value="UAE">UAE</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Thailand">Thailand</option>
        </select>

        {/* Price Filter */}
        <input
          type="number"
          placeholder="Max Price"
          className="border px-4 py-2 rounded w-full"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <img src={dest.image} alt={dest.name} className="w-full h-52 object-cover" />

            <div className="p-4">
              <h2 className="text-xl font-semibold">{dest.name}</h2>
              <p className="text-gray-600">{dest.country}</p>

              <p className="text-green-600 font-bold mt-2">₹{dest.price}</p>
              <p className="text-sm text-gray-500">{dest.days} Days</p>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No destinations found.
        </p>
      )}
    </div>
  );
};

export default DestinationsPage;
