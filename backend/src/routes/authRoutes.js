const express = require('express');

const {
  register,
  login,
  profile,
  updateProfile,
  logout
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);

module.exports = router;