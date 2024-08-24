const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, phone, pic } = req.body;

  // Validate required fields
  if (!name || !username || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create the user with optional phone and pic fields
  const user = await User.create({
    name,
    username,
    email,
    password,
    phone: phone || "", // Set to an empty string if not provided
    pic: pic || "",     // Set to an empty string if not provided
  });

  // If the user is successfully created, return the user details and token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Authenticate user and get token
//@route           POST /api/user/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const deleteAllUsers = asyncHandler(async (req, res) => {
  const result = await User.deleteMany({}); // This will delete all users from the database

  if (result.deletedCount > 0) {
    res.status(200).json({ message: "All users have been deleted" });
  } else {
    res.status(404).json({ message: "No users found to delete" });
  }
});

module.exports = { allUsers, registerUser, authUser , deleteAllUsers};
