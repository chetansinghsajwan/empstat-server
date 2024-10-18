import 'dotenv/config'
import jwt from 'jsonwebtoken'
import assert from 'assert'
import { env } from 'process'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utils/logging'

const accessTokenSecret: string = env.EMPSTAT_SERVER_ACCESS_TOKEN_SECRET || ''
const refreshTokenSecret: string = env.EMPSTAT_SERVER_REFRESH_TOKEN_SECRET || ''
const accessTokenExpireTime: string = env.EMPSTAT_SERVER_ACCESS_TOKEN_EXPIRE_TIME || ''

assert(accessTokenSecret, 'EMPSTAT_ACCESS_TOKEN_SECRET env variable not set')
assert(refreshTokenSecret, 'EMPSTAT_REFRESH_TOKEN_SECRET env variable not set')
assert(
    accessTokenExpireTime,
    'EMPSTAT_ACCESS_TOKEN_EXPIRE_TIME env variable not set',
)

export function createTokens(req: Request, res: Response, userid: string) {
    // we only allow 'admin' scope for now
    const scope = 'admin'

    const tokenData = { id: userid, scope: scope }
    const accessToken = jwt.sign(tokenData, accessTokenSecret, {
        expiresIn: accessTokenExpireTime,
    })

    const refreshToken = jwt.sign(tokenData, refreshTokenSecret)

    return res.status(StatusCodes.OK).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: accessTokenExpireTime,
        scope: scope,
    })
}

export function validateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        logger.info('validating access token')

        const token = req.cookies.accessToken
        const tokenData = jwt.verify(token, accessTokenSecret) as jwt.JwtPayload

        logger.info('validating access token successfull')

        res.locals.user = tokenData.id
        res.locals.scope = tokenData.scope
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
        const tokenData = jwt.verify(
            token,
            refreshTokenSecret,
        ) as jwt.JwtPayload

        logger.info('validating refresh token successfull')

        res.locals.user = tokenData.id
        res.locals.scope = tokenData.scope
        next()
    } catch (error) {
        logger.error('validating refresh token failed, invalid token', error)

        return res.status(StatusCodes.UNAUTHORIZED).send('invalid token')
    }
}

export function refreshAccessToken(req: Request, res: Response) {
    logger.info('refresh access token request recieved')

    const userid = res.locals.user
    assert(userid)

    const scope = res.locals.scope
    assert(scope)

    const user = { id: userid, scope: scope }
    const accessToken = jwt.sign(user, accessTokenSecret, {
        expiresIn: accessTokenExpireTime,
    })

    logger.info('refresh access token request completed')

    return res.status(StatusCodes.OK).send({
        accessToken: accessToken,
        expiresIn: accessTokenExpireTime,
    })
}

export default {
    createTokens,
    validateAccessToken,
    validateRefreshToken,
    refreshAccessToken,
}
