const express = require("express");
const {
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
} = require("../controllers/chatControllers");
const { createChat, getChats } = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const chatRouter = express.Router();

chatRouter.route("/").post(protect, createChat)
chatRouter.route("/").get(protect, getChats);
chatRouter.route("/group").post(protect, createGroupChat);
chatRouter.route("/rename").put(protect, renameGroup);
chatRouter.route("/groupremove").put(protect, removeFromGroup);
chatRouter.route("/groupadd").put(protect, addToGroup);

module.exports = chatRouter;
