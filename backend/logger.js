const winston = require("winston");
const fs = require("fs");
const path = require("path");

// Clear the log file before logging new errors
fs.writeFileSync('error.log', '', 'utf8'); 

const logDir = path.join(__dirname, "logs");
const logFilePath = path.join(logDir, "app.log");

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure Winston Logger
const logger = winston.createLogger({
  level: "info", // Logs info, warn, error
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath, level: "info" }), // Log to file
    new winston.transports.Console(), // Log to console
  ],
});

// Now we can log the start of the session
logger.error("Starting new log session...");

module.exports = logger;