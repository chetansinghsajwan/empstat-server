import 'dotenv/config'
import assert from 'assert'
import { env } from 'process'
import { logger } from '@utils/logging'
import app from '@app'

const port = env.EMPSTAT_SERVER_PORT
assert(port, 'port not defined')

app.listen(port, function () {
    logger.info(`server listening on port ${port}`)
})
