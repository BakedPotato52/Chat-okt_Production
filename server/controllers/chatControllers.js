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
    body('userId').isArray({ min: 1 }).withMessage('Users array is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.body;

        if (!userId) {
            console.log("UserId param not sent with request");
            return res.sendStatus(400);
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            {
                var chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [req.user._id, userId],
                };
            }

            try {
                const newChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
                    "users",
                    "-password"
                );
                res.status(201).json(fullChat);
                logger.info(`Chat created: ${newChat._id} by user ${req.user._id}`);
            } catch (error) {
                res.status(400);
                throw new Error(error.message);
            }
        }
    })
];

// @description Get all chats for a user
// @route       GET /api/chats
// @access      Protected
const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ users: { $in: [req.user._id] } })
        .populate("users", "-password")
        .populate("chatAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results);
        });

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
                chatAdmin: req.user,
            });

            const fullGroupChat = await Chat.findById(groupChat._id)
                .populate("users", "-password")
                .populate("chatAdmin", "-password");

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
                .populate("chatAdmin", "-password");

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
                .populate("chatAdmin", "-password");

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
                .populate("chatAdmin", "-password");

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
