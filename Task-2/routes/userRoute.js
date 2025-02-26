const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post("/logout", protect, logout);

module.exports = router;