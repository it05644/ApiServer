// logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Minimum level to log (info, warn, error, debug, etc.)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console({ level: 'debug' }), // Console logs everything from debug and above
    new transports.File({ filename: 'logs/server.log', level: 'info' }) // File logs only warn and above
  ]
});

module.exports = logger;
