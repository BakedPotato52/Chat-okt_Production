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

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    logger.warn(`404 Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Log the error
    logger.error({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
        url: req.originalUrl,
    });

    res.json({
        message: err.message,
        // Hide stack trace in production for security reasons
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
};

module.exports = { notFound, errorHandler };