const express = require("express");
const { createMessage, getMessages } = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const messageRouter = express.Router();

messageRouter.route("/").post(protect, createMessage);
messageRouter.route("/:chatId").get(protect, getMessages);

module.exports = messageRouter;
