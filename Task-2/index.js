require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./lib/db");
const userRoute = require("./routes/userRoute");
const busRoute = require("./routes/busRoute");
const routeRoute = require("./routes/routeRoute");
const bookingRoute = require("./routes/bookingRoute");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", userRoute);
app.use("/bus", busRoute);
app.use("/route", routeRoute);
app.use("/booking", bookingRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port " + process.env.PORT);
});
