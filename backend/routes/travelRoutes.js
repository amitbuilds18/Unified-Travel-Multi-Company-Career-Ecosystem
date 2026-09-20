import express from "express";
import {
  getFlights,
  getHotels,
  getActivities,
  getEngineStatus,
} from "../controllers/travelController.js";

const router = express.Router();

router.get("/flights", getFlights);
router.get("/hotels", getHotels);
router.get("/activities", getActivities);
router.get("/status", getEngineStatus);

export default router;
