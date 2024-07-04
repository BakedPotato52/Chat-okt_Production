const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
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

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user to the request object
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                logger.warn(`User not found for token: ${token}`);
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            logger.error(`Token verification failed: ${error.message}`);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        logger.warn("No token provided in authorization header");
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

module.exports = { protect };
