const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });
 

    // If user not found, return an error
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Log whether the password matches or not
    console.log("Password Match: ", isMatch);

    // If password does not match, return an error
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the JWT and send it in the response
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error("JWT Error: ", err);
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Server Error: ", err.message);
    res.status(500).send('Server error');
  }
};
