const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @description Create new chat
// @route       POST /api/chats
// @access      Protected
const createChat = asyncHandler(async (req, res) => {
    const { users, chatName } = req.body;

    if (!users || !users.length) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const chats = await Chat.create({
        users,
        chatName
    });

    res.status(201).json(chats);
});

// @description Get all chats for a user
// @route       GET /api/chats
const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ users: { $in: [req.user._id] } })
        .populate("users", "-password")
        .exec();

    res.status(200).json(chats);
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
    const { User, name } = req.body;

    if (!User || !name) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userArray = JSON.parse(User);

    if (userArray.length < 2) {
        return res.status(400).json({ message: "More than 2 User are required to form a group chat" });
    }

    userArray.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: name,
            User: userArray,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("User", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// @description     Rename Group
// @route           PUT /api/chat/rename
// @access          Protected
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
        return res.status(400).json({ message: "chatId and chatName are required" });
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName },
            { new: true }
        )
            .populate("User", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// @description     Remove user from Group
// @route           PUT /api/chat/groupremove
// @access          Protected
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try {
        const removed = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { User: userId } },
            { new: true }
        )
            .populate("User", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        res.status(200).json(removed);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// @description     Add user to Group / Leave
// @route           PUT /api/chat/groupadd
// @access          Protected
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { User: userId } },
            { new: true }
        )
            .populate("User", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        res.status(200).json(added);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createChat,
    getChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};