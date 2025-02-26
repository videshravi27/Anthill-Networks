const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Bus", busSchema);
