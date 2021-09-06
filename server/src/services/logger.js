const path = require('path');
const { createLogger, format, transports } = require('winston');

let logger;

if (process.env.NODE_ENV === 'development') {
  const devLogFormat = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  });

  logger = createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      devLogFormat
    ),
    transports: [new transports.Console()],
  });

  // Used for morgan
  logger.stream = {
    write: (message, encoding) => {
      logger.info(message);
    },
  };
} else {
  logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'web-service' },
    transports: [
      new transports.Console(),
      new transports.File({
        level: 'error',
        filename: path.join(__dirname, '../', '../', '/logs', 'stdout.log'),
        handleExceptions: true,
        colorize: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ],
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.json()
    ),
  });

  // Used for morgan
  logger.stream = {
    write: (message, encoding) => {
      // logger.info(message);
    },
  };
}

module.exports = logger;
