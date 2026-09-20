import {
  searchFlightsService,
  searchHotelsService,
  searchActivitiesService,
  getAmadeusStatus,
} from "../services/amadeusService.js";

export const getFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, adults } = req.query;
    const result = await searchFlightsService({
      origin,
      destination,
      departureDate,
      adults,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("getFlights error:", err);
    res.status(500).json({ success: false, message: "Flight search failed", error: err.message });
  }
};

export const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const result = await searchHotelsService({ city });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("getHotels error:", err);
    res.status(500).json({ success: false, message: "Hotel search failed", error: err.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { city } = req.query;
    const result = await searchActivitiesService({ city });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("getActivities error:", err);
    res.status(500).json({ success: false, message: "Activity search failed", error: err.message });
  }
};

export const getEngineStatus = (req, res) => {
  const status = getAmadeusStatus();
  res.json({ success: true, status });
};
