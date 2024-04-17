const { Router } = require("express");

const {
  getTripList,
  updateWishList,
  getPropertyList,
  getReservationList,
} = require("../controllers/tripControllers");

const router = Router();

// get trip list
router.get("/:userId/trips", getTripList);

// get property list
router.get("/:userId/properties", getPropertyList);

// get reservation list
router.get("/:userId/reservations", getReservationList);

// add wish list
router.patch("/:userId/:listingId", updateWishList);

module.exports = router;
