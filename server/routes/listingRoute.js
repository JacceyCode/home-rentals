const { Router } = require("express");
const {
  uploadListingPhotos,
  createListing,
  getListing,
  getSearchListing,
} = require("../controllers/listingController");

const router = Router();

router.get("/", getListing);
router.get("/search/:search", getSearchListing);
router.post("/create", uploadListingPhotos, createListing);

module.exports = router;
