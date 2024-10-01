import winston from 'winston'
import expressWinston from 'express-winston'

const mode = process.env.NODE_ENV || 'dev'

const consoleTransport = new winston.transports.Console({
    format: winston.format.cli(),
    handleExceptions: true,
    handleRejections: true,
})

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [consoleTransport],
})

export const requestLogger = expressWinston.logger({
    format: winston.format.json(),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    transports: [consoleTransport],
})

export const errorLogger = expressWinston.errorLogger({
    format: winston.format.json(),
    meta: true,
    transports: [consoleTransport],
})

export default {
    logger,
    requestLogger,
    errorLogger,
}
