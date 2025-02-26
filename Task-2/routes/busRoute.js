const express = require("express");
const { addBus, updateBus } = require("../controllers/busController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, addBus); 
router.put("/:busId", protect, adminOnly, updateBus);

module.exports = router;