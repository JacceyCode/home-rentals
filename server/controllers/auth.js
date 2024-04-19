const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/UserModel");
const { cloudinary } = require("../utils/cloudinary");

// multer configuration for file upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); //store uploaded files in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original file name
  },
});

const upload = multer({ storage: storage });

exports.uploadProfileImage = upload.single("profileImage");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).json("No profile image uploaded");
    }

    const uploadedProfileImage = await cloudinary.uploader.upload(
      profileImage.path,
      {
        upload_preset: "home_rentals",
      }
    );

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      profileImagePath: uploadedProfileImage.secure_url,
    });

    newUser.password = undefined;

    res.status(200).json({
      status: "success",
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Registration failed",
      error: err.message.includes("duplicate key")
        ? "User already exists."
        : err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // get login details from body
    const { email, password } = req.body;
    // check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User doesn't exist.",
      });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid credential.",
      });
    }

    // generate jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // // To send token as cookie
    const cookieOptions = {
      expire: Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
      httpOnly: true,
      secure: true,
    };

    // to set new cookie
    res.cookie("jwtoken", token, cookieOptions);

    user.password = undefined;

    res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: "User login failed",
      message: err.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  // to clear old cookie
  await res.clearCookie("jwtoken");
  res.status(201).json("Log out successful");
};
