const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const winston = require("winston");

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// @description Create new message
// @route       POST /api/messages
// @access      Protected
const createMessage = [
    body('content').not().isEmpty().withMessage('Content is required'),
    body('chatId').not().isEmpty().withMessage('Chat ID is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content, chatId } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }

        const message = await Message.create({
            sender: req.user._id,
            content,
            chat: chatId,
        });

        logger.info(`Message created: ${message._id} by user ${req.user._id}`);
        res.status(201).json(message);
    })
];

// @description Get all messages for a chat
// @route       GET /api/messages/:chatId
// @access      Protected
const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    const messages = await Message.find({ chat: chatId })
        .populate("sender", "name pic email")
        .populate("chat");

    if (!messages) {
        res.status(404);
        throw new Error("Messages not found");
    }

    logger.info(`Messages retrieved for chat: ${chatId} by user ${req.user._id}`);
    res.status(200).json(messages);
});

module.exports = { createMessage, getMessages };
