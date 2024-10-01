import 'dotenv/config'
import jwt from 'jsonwebtoken'
import assert from 'assert'
import { env } from 'process'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '../utils/logging'

const accessTokenSecret: string = env.EMPSTAT_ACCESS_TOKEN_SECRET || ''
const refreshTokenSecret: string = env.EMPSTAT_REFRESH_TOKEN_SECRET || ''
const accessTokenExpireTime: string = env.EMPSTAT_ACCESS_TOKEN_EXPIRE_TIME || ''

assert(accessTokenSecret, 'EMPSTAT_ACCESS_TOKEN_SECRET env variable not set')
assert(refreshTokenSecret, 'EMPSTAT_REFRESH_TOKEN_SECRET env variable not set')
assert(
    accessTokenExpireTime,
    'EMPSTAT_ACCESS_TOKEN_EXPIRE_TIME env variable not set',
)

export function createTokens(req: Request, res: Response, userId: string) {
    const user = { id: userId }
    const accessToken = jwt.sign(user, accessTokenSecret, {
        expiresIn: accessTokenExpireTime,
    })

    const refreshToken = jwt.sign(user, refreshTokenSecret)

    return res
        .status(StatusCodes.OK)
        .cookie('accessToken', accessToken)
        .cookie('refreshToken', refreshToken)
        .send()
}

export function validateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        logger.info('validating access token')

        const token = req.cookies.accessToken
        const user = jwt.verify(token, accessTokenSecret)

        logger.info('validating access token successfull')

        res.locals.user = (user as any).id
        next()
    } catch (error) {
        logger.error(
            'validating access token failed, invalid token, error: ',
            error,
        )

        return res.status(StatusCodes.UNAUTHORIZED).send('invalid token')
    }
}

export function validateRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        logger.info('validating refresh token')

        const token = req.cookies.refreshToken
        const user = jwt.verify(token, refreshTokenSecret)

        logger.info('validating refresh token successfull')

        res.locals.user = (user as any).id
        next()
    } catch (error) {
        logger.error('validating refresh token failed, invalid token', error)

        return res.status(StatusCodes.UNAUTHORIZED).send('invalid token')
    }
}

export function refreshAccessToken(req: Request, res: Response) {
    logger.info('refresh access token request recieved')

    const userId = res.locals.user
    assert(userId)

    const user = { id: userId }
    const accessToken = jwt.sign(user, accessTokenSecret, {
        expiresIn: accessTokenExpireTime,
    })

    logger.info('refresh access token request completed')

    return res.status(StatusCodes.OK).cookie('accessToken', accessToken).send()
}

export default {
    createTokens,
    validateAccessToken,
    validateRefreshToken,
    refreshAccessToken,
}
