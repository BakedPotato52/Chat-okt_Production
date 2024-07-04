const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");


// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Security middleware to set various HTTP headers
app.use(helmet());


// Enable CORS with specific origins
app.use(cors({
    origin: [
        "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build', 'index.html')));

// Basic route to check API status
// app.get("/", (req, res) => {
//     res.send("API Running!");
// });

// Mount routers
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`.green.bold));

// Setup Socket.io
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: [
            "http://localhost:3000"
        ],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        const chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
