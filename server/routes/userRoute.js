const { Router } = require("express");

const {
  uploadProfileImage,
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth");

const router = Router();

// USER REGISTRATION -/POST
router.post("/register", uploadProfileImage, createUser);

// USER LOGIN - /POST
router.post("/login", loginUser);

// USER LOGOUT
router.get("/logout", logoutUser);

module.exports = router;
