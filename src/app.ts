import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logging from './utils/logging'
import errorHandler from './middlewares/errorHandler'
import router from './routes'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logging.requestLogger)
app.use(router)
app.use(logging.errorLogger)
app.use(errorHandler)

export default app
