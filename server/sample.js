const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://kanakacharya52:pbmbYmZExHUcS6Ig@message.jmfthol.mongodb.net";

mongoose.connect(mongoURI, {})
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });

const createSampleData = async () => {
    try {
        // Ensure users are created if not existing
        const user1Email = 'kanakacharya52@gmail.com';
        const user2Email = 'guest@example.com';

        let user1 = await User.findOne({ email: user1Email });
        let user2 = await User.findOne({ email: user2Email });

        if (!user1) {
            user1 = new User({ name: 'User One', email: user1Email, password: await bcrypt.hash('kanak', 10) });
            await user1.save();
        }

        if (!user2) {
            user2 = new User({ name: 'Guest User', email: user2Email, password: await bcrypt.hash('123456', 10) });
            await user2.save();
        }

        const chat = new Chat({
            chatName: 'convo',
            isGroupChat: false,
            users: [user1._id, user2._id]
        });
        await chat.save();

        // Create sample messages
        const messages = [
            {
                sender: user1._id,
                content: 'Hello, how are you?',
                chat: chat._id,
            },
            {
                sender: user2._id,
                content: 'I\'m good, thanks! How about you?',
                chat: chat._id,
            },
            {
                sender: user1._id,
                content: 'I\'m doing great, thanks for asking!',
                chat: chat._id,
            }
        ];

        await Message.insertMany(messages);
        console.log('Sample data created');
        process.exit();
    } catch (error) {
        console.error('Error creating sample data:', error);
        process.exit(1);
    }
};

createSampleData();
