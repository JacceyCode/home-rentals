const { Router } = require("express");

const { createBooking } = require("../controllers/bookingController");

const router = Router();

router.post("/create", createBooking);

module.exports = router;
