import Booking from "../models/Booking.js";

export const addBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      userId: req.userId,
      destinationId: req.body.destinationId,
      destinationTitle: req.body.destinationTitle,
      hotelName: req.body.hotelName,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      amount: req.body.amount,
      paymentId: req.body.paymentId || "PAY_DIRECT_" + Date.now(),
      status: "CONFIRMED",
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking failed", error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ userId: req.userId }, { user: req.userId }],
    })
      .populate("destinationId")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load bookings", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId", "name email phone")
      .populate("destinationId", "title country images")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load all bookings", error: error.message });
  }
};
