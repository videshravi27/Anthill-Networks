const express = require("express");
const { addRoute, updateRoute } = require("../controllers/routeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, addRoute); 
router.put("/:routeId", protect, adminOnly, updateRoute); 

module.exports = router;