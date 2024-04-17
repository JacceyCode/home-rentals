const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const List = require("../models/ListingModel");

exports.getTripList = async (req, res) => {
  try {
    const { userId } = req.params;

    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );

    res.status(200).json({
      status: "success",
      trips,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.updateWishList = async (req, res) => {
  try {
    const { userId } = req.params;
    const newWishList = req.body;
    // console.log(req.headers.authorization);

    const user = await User.findByIdAndUpdate(
      userId,
      { wishList: newWishList },
      {
        new: true,
      }
    );

    res.status(202).json({
      status: "success",
      message: "Wish list updated successfully.",
      wishList: user.wishList,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Failed to update wishlist.",
      error: err.message,
    });
  }
};

exports.getPropertyList = async (req, res) => {
  try {
    const { userId } = req.params;

    const properties = await List.find({ creator: userId }).populate("creator");

    res.status(200).json({
      status: "success",
      properties,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.getReservationList = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await Booking.find({ hostId: userId }).populate(
      "customerId hostId listingId"
    );

    res.status(200).json({
      status: "success",
      reservations,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: err.message,
    });
  }
};
