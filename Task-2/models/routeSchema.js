const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  startPoint: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  stops: [
    {
      type: String,
      required: true,
    },
  ],
  distance: {
    type: Number,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Route", routeSchema);
