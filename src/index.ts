import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logging, { logger } from './utils/logging'
import errorHandler from './middlewares/errorHandler'
import router from './routes'
import assert from 'assert'
import { env } from 'process'

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(logging.requestLogger)
app.use(router)
app.use(logging.errorLogger)
app.use(errorHandler)

const port = env.EMPSTAT_SERVER_PORT
assert(port, 'port not defined')

app.listen(port, function () {
    logger.info(`server listening on port ${port}`)
})
