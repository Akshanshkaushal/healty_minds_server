const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  deleteAllUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

router.route('/').get(allUsers).post(registerUser).delete(deleteAllUsers); // Added the DELETE route here


module.exports = router;
