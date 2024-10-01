import winston from 'winston'
import expressWinston from 'express-winston'
import { env } from 'process'

const mode = env.EMPSTAT_NODE_ENV || 'dev'

const consoleTransport = new winston.transports.Console({
    format: winston.format.cli(),
    handleExceptions: true,
    handleRejections: true,
})

export const logger = winston.createLogger({
    level: env.EMPSTAT_LOG_LEVEL || 'info',
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
