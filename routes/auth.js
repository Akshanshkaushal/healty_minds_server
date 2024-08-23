const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signup');
const loginController = require('../controllers/login');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupController.signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginController.login);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
