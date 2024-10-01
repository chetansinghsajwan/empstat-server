import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import { logger } from '../utils/logging'
import db from '../modals'
import assert from 'assert'
import authController from './auth'

const passwordHashSaltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS || '10')

export async function createUser(req: Request, res: Response) {
    logger.info('create user request recieved')

    const existingUser = await db.user.findUnique({
        where: { id: req.body.id },
    })

    if (existingUser !== null) {
        logger.info('create user request rejected, user with this id address already exists')

        return res.status(StatusCodes.CONFLICT).send({
            error: 'create user request rejected, user with this id address already exists',
        })
    }

    const hashPassword = await bcrypt.hash(req.body.password, passwordHashSaltRounds)
    req.body.password = hashPassword

    const user = await db.user.create({ data: req.body })
    logger.info('create user request completed')

    return authController.createTokens(req, res, user.id)
}

export async function deleteUser(req: Request, res: Response) {
    logger.info(`delete user request recieved`)

    const userId = res.locals.user
    assert(userId)

    const user = await db.user.delete({ where: { id: userId } })

    if (!user) {
        logger.info('delete user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send('user not found')
    }

    logger.info(`delete user request completed`)

    return res.status(StatusCodes.OK).send('user deleted')
}

export async function loginUser(req: Request, res: Response) {
    logger.info('login user request recieved')

    const userId = req.body.id
    const password = req.body.password

    const user = await db.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        logger.info('login user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send('user not found')
    }

    const passwordMatched = await bcrypt.compare(password, user.password)
    if (!passwordMatched) {
        logger.info('login user request rejected, password does not match')

        return res.status(StatusCodes.UNAUTHORIZED).send('password does not match')
    }

    logger.info('login user request completed')

    return authController.createTokens(req, res, user.id)
}

export async function getUser(req: Request, res: Response) {
    const userId = res.locals.user
    assert(userId)

    logger.info(`get user request recieved, id:${userId}`)

    const user = await db.user.findUnique({
        where: { id: userId },
    })

    if (user === null) {
        logger.info('get user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send('user not found')
    }

    logger.info('get user request completed')

    return res.status(StatusCodes.OK).send(user)
}

export async function getUsers(req: Request, res: Response) {
    logger.info('get users request recieved')

    const userId = res.locals.user
    assert(userId)

    const user = await db.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        logger.info('login user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send('user not found')
    }

    const users = await db.user.findMany()

    logger.info('request complete')
    return res.status(StatusCodes.OK).send(users)
}

export default {
    createUser,
    deleteUser,
    loginUser,
    getUser,
    getUsers,
}
