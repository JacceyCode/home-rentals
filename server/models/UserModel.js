const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name."],
      minLength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name."],
      minLength: [3, "Last name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password."],
      minLength: [6, "Password must be a minimum of 6 characters."],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords does not match",
      },
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    tripList: {
      type: Array,
      default: [{}],
    },
    wishList: {
      type: Array,
      default: [{}],
    },
    propertyList: {
      type: Array,
      default: [{}],
    },
    reservationList: {
      type: Array,
      default: [{}],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware for password encryption or Hashing
UserSchema.pre("save", async function (next) {
  // This helps to only run the function if password was modified
  if (!this.isModified("password")) return next();

  // Hash or encrypt the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirm password field
  this.confirmPassword = undefined;

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
