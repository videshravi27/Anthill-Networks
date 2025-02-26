const express = require("express");
const {
  bookBus,
  cancelBooking,
  getUserBookings,
  getAllBookings,
} = require("../controllers/bookingController");
const {
  protect,
  adminOnly,
  userOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, userOnly, bookBus);
router.delete("/:bookingId", protect, userOnly, cancelBooking); 
router.get("/", protect, userOnly, getUserBookings);
router.get("/all", protect, adminOnly, getAllBookings); 

module.exports = router;
