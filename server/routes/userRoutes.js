const express = require("express");
const { registerUser, authUser, allUsers, updateUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.route("/").post(registerUser).get(protect, allUsers);
userRouter.route("/login").post(authUser);
userRouter.route("/update").put(protect, updateUser);

module.exports = userRouter;
