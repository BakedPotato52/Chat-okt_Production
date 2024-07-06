const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

// @description Create new message
// @route       POST /api/messages
// @access      Protected
const createMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const message = await Message.create({
        sender: req.user._id,
        content,
        chat: chatId,
    });

    res.status(201).json(message);
});

// @description Get all messages for a chat
// @route       GET /api/messages/:chatId
// @access      Protected
const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
        .populate("sender", "name pic email")
        .populate("chat");

    res.status(200).json(messages);
});

module.exports = { createMessage, getMessages };