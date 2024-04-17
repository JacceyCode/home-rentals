const Booking = require("../models/BookingModel");

exports.createBooking = async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
      req.body;

    const newBooking = await Booking.create({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(200).json({
      status: "success",
      message: "Booking created successfully!",
      newBooking,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Booking failed",
      error: err.message,
    });
  }
};

// exports.getBooking = async (req, res) => {};
