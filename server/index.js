const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const helmet = require("helmet");

const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Define CSP policy
const cspDirectives = {
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://images.app.goo.gl", "https://avatars.githubusercontent.com", "https://icon-library.com/"],
        connectSrc: ["'self'", "https://chat-ok.onrender.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://chat-ok.onrender.com"]
    }
};

// Use Helmet with the specified CSP policy
// Security middleware to set various HTTP headers
app.use(helmet.contentSecurityPolicy(cspDirectives));

// Security middleware to set various HTTP headers

// Enable CORS with specific origins
// Use CORS middleware to allow cross-origin requests
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://chat-ok.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("/", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------

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
            "http://localhost:3000",
            "http://localhost:5000",
            "https://chat-ok.onrender.com",
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
