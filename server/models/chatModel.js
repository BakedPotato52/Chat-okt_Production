const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
    chatName: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    chatAdmin: { type: Boolean, default: false },
}, { timestamps: true });

// Index to quickly find chats by users
chatSchema.index({ users: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;