const { Router } = require("express");

const {
  //   getBooking,
  createBooking,
} = require("../controllers/bookingController");

const router = Router();

router.post("/create", createBooking);
// router.get("/", getBooking);

module.exports = router;
