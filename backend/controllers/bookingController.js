import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";

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

    if (req.userId) {
      try {
        await Notification.create({
          userId: req.userId,
          title: "Holiday Booking Confirmed ✈️",
          message: `Your booking for "${booking.destinationTitle || "Holiday Package"}" is confirmed. Travel voucher issued!`,
          type: "BOOKING_CONFIRMED",
          link: "/my-bookings",
        });
      } catch (e) {}
    }

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

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [{ userId: req.userId }, { user: req.userId }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized",
      });
    }

    booking.status = "CANCELLED";
    await booking.save();

    if (booking.userId) {
      try {
        await Notification.create({
          userId: booking.userId,
          title: "Booking Cancelled 💳",
          message: `Your booking for "${booking.destinationTitle}" was cancelled. Full refund has been initiated.`,
          type: "BOOKING_CANCELLED",
          link: "/my-bookings",
        });
      } catch (e) {}
    }

    res.json({
      success: true,
      message: "Booking has been cancelled successfully. Full refund initiated.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
