const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

// Indexes to optimize query performance
messageSchema.index({ chat: 1, createdAt: -1 }); // Index for retrieving messages by chat in descending order of creation time
messageSchema.index({ sender: 1 }); // Index for retrieving messages by sender

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
