import dotenv from "dotenv";

dotenv.config();

// Token cache for real Amadeus calls
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get OAuth2 Bearer token from Amadeus (Self-Service Test Environment)
 */
async function getAmadeusToken() {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.includes("your_")) {
    return null;
  }

  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!res.ok) {
      console.warn("Amadeus OAuth token failed with status:", res.status);
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token;
    // Set expiry with a 60-second buffer
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return cachedToken;
  } catch (err) {
    console.warn("Amadeus OAuth connection failed, switching to mock:", err.message);
    return null;
  }
}

/**
 * Realistic Mock Flight Data Generator
 */
function getMockFlights(origin = "DEL", destination = "DXB", departureDate = "2026-10-15") {
  const airlines = [
    {
      airline: "Emirates",
      code: "EK",
      flightNo: "EK-512",
      logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80",
      departureTime: "04:15",
      arrivalTime: "06:45",
      duration: "4h 00m",
      stops: "Non-stop",
      price: 24500,
      cabinClass: "Economy",
      baggage: "30 kg check-in + 7 kg cabin",
    },
    {
      airline: "IndiGo",
      code: "6E",
      flightNo: "6E-1452",
      logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80",
      departureTime: "08:30",
      arrivalTime: "11:15",
      duration: "4h 15m",
      stops: "Non-stop",
      price: 16800,
      cabinClass: "Economy",
      baggage: "20 kg check-in + 7 kg cabin",
    },
    {
      airline: "Air India",
      code: "AI",
      flightNo: "AI-995",
      logo: "https://images.unsplash.com/photo-1520437358207-323b43b50729?w=100&auto=format&fit=crop&q=80",
      departureTime: "14:20",
      arrivalTime: "17:00",
      duration: "4h 10m",
      stops: "Non-stop",
      price: 19400,
      cabinClass: "Economy (Hot Meals Incl.)",
      baggage: "25 kg check-in + 7 kg cabin",
    },
    {
      airline: "Qatar Airways",
      code: "QR",
      flightNo: "QR-571",
      logo: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=100&auto=format&fit=crop&q=80",
      departureTime: "10:00",
      arrivalTime: "16:20",
      duration: "6h 20m",
      stops: "1 Stop (DOH 1h 20m)",
      price: 28900,
      cabinClass: "World Best Economy",
      baggage: "35 kg check-in + 7 kg cabin",
    },
  ];

  return {
    source: "Mock Amadeus Flight Engine",
    searchMeta: {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      currency: "INR",
      resultsCount: airlines.length,
    },
    data: airlines.map((item, idx) => ({
      id: `FLIGHT-${idx + 1}-${Date.now()}`,
      type: "flight-offer",
      ...item,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
    })),
  };
}

/**
 * Realistic Mock Hotel Data Generator
 */
function getMockHotels(city = "Dubai") {
  const hotelsList = [
    {
      id: "HTL-DXB-01",
      name: "JW Marriott Marquis Hotel",
      city: "Dubai",
      country: "UAE",
      starRating: 5,
      guestRating: 4.9,
      reviewsCount: 1420,
      address: "Sheikh Zayed Rd, Business Bay, Dubai",
      pricePerNight: 12500,
      currency: "INR",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      amenities: ["Free High-Speed WiFi", "Infinity Pool", "Luxury Spa", "Buffet Breakfast", "Airport Shuttle"],
    },
    {
      id: "HTL-DXB-02",
      name: "Rove Downtown by Emaar",
      city: "Dubai",
      country: "UAE",
      starRating: 4,
      guestRating: 4.7,
      reviewsCount: 980,
      address: "Financial Centre Road, Downtown Dubai",
      pricePerNight: 6800,
      currency: "INR",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      amenities: ["Burj Khalifa View", "Outdoor Pool", "Fitness Center", "Free Parking"],
    },
    {
      id: "HTL-BLI-01",
      name: "Komaneka at Bisma Ubud Resort",
      city: "Bali",
      country: "Indonesia",
      starRating: 5,
      guestRating: 4.95,
      reviewsCount: 840,
      address: "Jl. Bisma, Ubud, Gianyar, Bali",
      pricePerNight: 9500,
      currency: "INR",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      amenities: ["Private Pool Villas", "Valley View", "Ayurvedic Spa", "Daily Yoga"],
    },
    {
      id: "HTL-SWZ-01",
      name: "Victoria-Jungfrau Grand Hotel & Spa",
      city: "Interlaken",
      country: "Switzerland",
      starRating: 5,
      guestRating: 4.9,
      reviewsCount: 650,
      address: "Höheweg 41, 3800 Interlaken, Switzerland",
      pricePerNight: 24000,
      currency: "INR",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      amenities: ["Glacier Views", "Thermal Spa", "Michelin Dining", "Private Ski Transfers"],
    },
  ];

  const filtered = hotelsList.filter(
    (h) =>
      h.city.toLowerCase().includes(city.toLowerCase()) ||
      h.country.toLowerCase().includes(city.toLowerCase()) ||
      city.toLowerCase() === "all"
  );

  return {
    source: "Mock Amadeus Hotel Engine",
    city,
    resultsCount: (filtered.length > 0 ? filtered : hotelsList).length,
    data: filtered.length > 0 ? filtered : hotelsList,
  };
}

/**
 * Realistic Mock Activities / Sightseeing Generator
 */
function getMockActivities(city = "Dubai") {
  const activities = [
    {
      id: "ACT-01",
      name: "Burj Khalifa 124th & 125th Floor Observation Deck",
      city: "Dubai",
      duration: "2 Hours",
      price: 3400,
      currency: "INR",
      rating: 4.9,
      reviewsCount: 3200,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
      tags: ["Iconic Landmark", "Fast-Track Entry", "Mobile Ticket"],
    },
    {
      id: "ACT-02",
      name: "Red Dunes Desert Safari with BBQ Dinner & Dune Bashing",
      city: "Dubai",
      duration: "6 Hours",
      price: 2800,
      currency: "INR",
      rating: 4.88,
      reviewsCount: 2410,
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80",
      tags: ["4x4 SUV", "Camel Ride", "Dinner Included", "Live Shows"],
    },
    {
      id: "ACT-03",
      name: "Nusa Penida Island Catamaran Cruise & Kelingking Cliff",
      city: "Bali",
      duration: "Full Day (8 Hours)",
      price: 4500,
      currency: "INR",
      rating: 4.92,
      reviewsCount: 1890,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      tags: ["Speedboat Included", "Buffet Lunch", "Snorkeling"],
    },
    {
      id: "ACT-04",
      name: "Jungfraujoch 'Top of Europe' Cogwheel Railway Ticket",
      city: "Switzerland",
      duration: "Full Day",
      price: 14500,
      currency: "INR",
      rating: 4.97,
      reviewsCount: 1420,
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
      tags: ["Eiger Express Gondola", "Ice Palace", "Alpine Panorama"],
    },
  ];

  return {
    source: "Mock Amadeus Activities Engine",
    city,
    data: activities,
  };
}

/**
 * Exported Travel Service API
 */
export const searchFlightsService = async (params) => {
  const { origin = "DEL", destination = "DXB", departureDate = "2026-10-15", adults = 1 } = params;

  const forceMock = process.env.AMADEUS_USE_MOCK !== "false";
  const token = forceMock ? null : await getAmadeusToken();

  // If real token available, call real Amadeus Live/Test API
  if (token) {
    try {
      const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&max=5&currencyCode=INR`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const liveData = await res.json();
        const carriers = liveData.dictionaries?.carriers || {};
        const formattedFlights = (liveData.data || []).map((offer, idx) => {
          const itinerary = offer.itineraries?.[0];
          const firstSegment = itinerary?.segments?.[0];
          const lastSegment = itinerary?.segments?.[itinerary.segments.length - 1];
          const carrierCode = firstSegment?.carrierCode || "Flight";
          const airlineName = carriers[carrierCode] || carrierCode;
          const flightNumber = `${carrierCode}-${firstSegment?.number || idx + 101}`;
          
          const depTime = firstSegment?.departure?.at ? firstSegment.departure.at.split("T")[1]?.slice(0, 5) : "08:00";
          const arrTime = lastSegment?.arrival?.at ? lastSegment.arrival.at.split("T")[1]?.slice(0, 5) : "12:00";
          let duration = itinerary?.duration ? itinerary.duration.replace("PT", "").toLowerCase() : "4h 00m";
          const stopsCount = (itinerary?.segments?.length || 1) - 1;

          return {
            id: offer.id || `LIVE-${idx}`,
            airline: airlineName,
            code: carrierCode,
            flightNo: flightNumber,
            logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80",
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: duration,
            stops: stopsCount === 0 ? "Non-stop" : `${stopsCount} Stop`,
            price: Math.round(Number(offer.price?.total || 18000)),
            cabinClass: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "Economy",
            baggage: "Standard Checked Baggage Included",
            origin: firstSegment?.departure?.iataCode || origin,
            destination: lastSegment?.arrival?.iataCode || destination,
            raw: offer,
          };
        });

        return {
          source: "Live Amadeus API (Production/Test)",
          searchMeta: {
            origin,
            destination,
            departureDate,
            resultsCount: formattedFlights.length,
          },
          data: formattedFlights.length > 0 ? formattedFlights : getMockFlights(origin, destination, departureDate).data,
        };
      }
    } catch (err) {
      console.warn("Live Amadeus call failed, falling back to mock:", err.message);
    }
  }

  // Fallback to high-fidelity mock engine
  return getMockFlights(origin, destination, departureDate);
};

export const searchHotelsService = async (params) => {
  const { city = "Dubai" } = params;
  return getMockHotels(city);
};

export const searchActivitiesService = async (params) => {
  const { city = "Dubai" } = params;
  return getMockActivities(city);
};

export const getAmadeusStatus = () => {
  const hasKeys =
    Boolean(process.env.AMADEUS_CLIENT_ID) &&
    !process.env.AMADEUS_CLIENT_ID.includes("your_");

  const useMock = process.env.AMADEUS_USE_MOCK !== "false";

  return {
    mode: useMock || !hasKeys ? "Mock Mode (Fully Functional)" : "Live Amadeus Mode",
    isMock: useMock || !hasKeys,
    hasCredentials: hasKeys,
    provider: "Amadeus Travel GDS",
  };
};
