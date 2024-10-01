import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import assert from 'assert'

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())

const port = process.env.EMPSTAT_SERVER_PORT
assert(port, 'port not defined')

app.listen(port, function () {
    console.log(`server listening on port ${port}`)
})
