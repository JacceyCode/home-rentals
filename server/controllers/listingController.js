const multer = require("multer");
const sharp = require("sharp");

const Listing = require("../models/ListingModel");

// multer configuration for photo upload

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads"); //store uploaded files in the uploads folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // use the original file name
//   },
// });

const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage });

exports.uploadListingPhotos = upload.array("listingPhotos");

exports.createListing = async (req, res) => {
  try {
    // Retrieve information from the req body
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDescription,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (listingPhotos.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No images uploaded",
      });
    }

    listingPhotos.map(
      async (file) =>
        await sharp(file.buffer)
          .resize(500, 500)
          .toFile(`public/uploads/${file.originalname}`)
    );

    const listingPhotoPaths = listingPhotos.map(
      (file) => `uploads/${file.originalname}`
    );

    const newListing = await Listing.create({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDescription,
      price,
    });

    res.status(200).json({
      status: "success",
      message: "Rental Listing created successfully!",
      newListing,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Rental listing failed",
      error: err.message,
    });
  }
};

exports.getListing = async (req, res) => {
  const qCategory = req.query.category;
  try {
    let listings;

    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        "creator"
      );
    } else {
      listings = await Listing.find().populate("creator");
    }

    res.status(200).json({
      status: "success",
      listings,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Failed to get rentals listing.",
      error: err.message,
    });
  }
};

exports.getSearchListing = async (req, res) => {
  const { search } = req.params;
  try {
    let listings = [];

    if (search === "all") {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }

    res.status(200).json({
      status: "success",
      listings,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Failed to get rentals listing.",
      error: err.message,
    });
  }
};
