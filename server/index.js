const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/userRoute");
const listingRoutes = require("./routes/listingRoute");
const bookingRoutes = require("./routes/bookingRoute");
const tripRoutes = require("./routes/tripRoute");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "https://vacation-home-rental-three.vercel.app",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/auth", userRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", tripRoutes);

// DB SETUP
const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
const port = process.env.PORT;
mongoose
  .connect(DB)
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )
  .catch((err) => console.log(`Could not establish connect: ${err}`));
