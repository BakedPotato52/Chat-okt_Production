const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
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

// @description Create new chat
// @route       POST /api/chats
// @access      Protected
const createChat = [
    body('users').isArray({ min: 1 }).withMessage('Users array is required'),
    body('chatName').not().isEmpty().withMessage('Chat name is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { users, chatName } = req.body;

        const chat = await Chat.create({
            users,
            chatName,
        });

        logger.info(`Chat created: ${chat._id} by user ${req.user._id}`);
        res.status(201).json(chat);
    })
];

// @description Get all chats for a user
// @route       GET /api/chats
// @access      Protected
const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ users: { $in: [req.user._id] } })
        .populate("users", "-password")
        .exec();

    if (!chats) {
        res.status(404);
        throw new Error("Chats not found");
    }

    logger.info(`Chats retrieved for user ${req.user._id}`);
    res.status(200).json(chats);
});

// @description Create New Group Chat
// @route       POST /api/chat/group
// @access      Protected
const createGroupChat = [
    body('User').isArray({ min: 2 }).withMessage('More than 2 users are required'),
    body('name').not().isEmpty().withMessage('Group name is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { User, name } = req.body;
        const userArray = [...User, req.user];

        try {
            const groupChat = await Chat.create({
                chatName: name,
                users: userArray,
                isGroupChat: true,
                groupAdmin: req.user,
            });

            const fullGroupChat = await Chat.findById(groupChat._id)
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            logger.info(`Group chat created: ${groupChat._id} by user ${req.user._id}`);
            res.status(200).json(fullGroupChat);
        } catch (error) {
            logger.error(`Error creating group chat: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    })
];

// @description Rename Group
// @route       PUT /api/chat/rename
// @access      Protected
const renameGroup = [
    body('chatId').not().isEmpty().withMessage('Chat ID is required'),
    body('chatName').not().isEmpty().withMessage('Chat name is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { chatId, chatName } = req.body;

        try {
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { chatName },
                { new: true }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!updatedChat) {
                return res.status(404).json({ message: "Chat Not Found" });
            }

            logger.info(`Group chat renamed: ${chatId} to ${chatName} by user ${req.user._id}`);
            res.status(200).json(updatedChat);
        } catch (error) {
            logger.error(`Error renaming group chat: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    })
];

// @description Remove user from Group
// @route       PUT /api/chat/groupremove
// @access      Protected
const removeFromGroup = [
    body('chatId').not().isEmpty().withMessage('Chat ID is required'),
    body('userId').not().isEmpty().withMessage('User ID is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { chatId, userId } = req.body;

        try {
            const removed = await Chat.findByIdAndUpdate(
                chatId,
                { $pull: { users: userId } },
                { new: true }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!removed) {
                return res.status(404).json({ message: "Chat Not Found" });
            }

            logger.info(`User ${userId} removed from group chat ${chatId} by user ${req.user._id}`);
            res.status(200).json(removed);
        } catch (error) {
            logger.error(`Error removing user from group chat: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    })
];

// @description Add user to Group / Leave
// @route       PUT /api/chat/groupadd
// @access      Protected
const addToGroup = [
    body('chatId').not().isEmpty().withMessage('Chat ID is required'),
    body('userId').not().isEmpty().withMessage('User ID is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { chatId, userId } = req.body;

        try {
            const added = await Chat.findByIdAndUpdate(
                chatId,
                { $push: { users: userId } },
                { new: true }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!added) {
                return res.status(404).json({ message: "Chat Not Found" });
            }

            logger.info(`User ${userId} added to group chat ${chatId} by user ${req.user._id}`);
            res.status(200).json(added);
        } catch (error) {
            logger.error(`Error adding user to group chat: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    })
];

module.exports = {
    createChat,
    getChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};
