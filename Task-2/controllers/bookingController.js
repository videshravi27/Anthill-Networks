const Booking = require("../models/bookingSchema");
const Bus = require("../models/busSchema");
const Route = require("../models/routeSchema");

const bookBus = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can book a bus" });
    }

    const { busId, routeId, seatsBooked } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (seatsBooked > bus.capacity) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalFare = bus.fare * seatsBooked;

    const booking = new Booking({
      userId: req.user.id,
      busId,
      routeId,
      seatsBooked,
      totalFare,
    });

    await booking.save();
    return res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can cancel a booking" });
    }

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this booking" });
    }

    await Booking.findByIdAndDelete(bookingId);

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancellation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can view their bookings" });
    }

    const bookings = await Booking.find({ userId: req.user.id })
      .populate("busId", "busNumber")
      .populate("routeId", "startPoint endPoint");

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can view all bookings" });
    }

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("busId", "busNumber")
      .populate("routeId", "startPoint endPoint");

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { bookBus, cancelBooking, getUserBookings, getAllBookings };