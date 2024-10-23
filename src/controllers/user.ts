import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from 'process'
import bcrypt from 'bcrypt'
import { logger } from '@utils/logging'
import prisma from '@modals'
import assert from 'assert'
import authController from '@controllers/auth'
import { Prisma } from '@prisma/client'
import * as schema from '@schemas/user'

const passwordHashSaltRoundsString = env.EMPSTAT_SERVER_PASSWORD_HASH_SALT_ROUNDS
assert(
    passwordHashSaltRoundsString !== undefined,
    'EMPSTAT_PASSWORD_HASH_SALT_ROUNDS env var is not set',
)

const passwordHashSaltRounds = parseInt(passwordHashSaltRoundsString)

export async function createUser(req: schema.CreateUserRequest, res: Response) {
    logger.info('create user request recieved')

    const existingUser = await prisma.user.findUnique({
        where: { id: req.body.id },
    })

    if (existingUser) {
        logger.info(
            'create user request rejected, user with this id already exists',
        )

        return res.status(StatusCodes.CONFLICT).send({
            error: 'user with this id already exists',
        })
    }

    const userWithExistingEmail = await prisma.user.findUnique({
        where: { email: req.body.email },
    })

    if (userWithExistingEmail) {
        logger.info(
            'create user request rejected, user with email already exists.',
        )

        return res.status(StatusCodes.CONFLICT).send({
            error: 'user with this email address already exists',
        })
    }

    const hashedPassword = await bcrypt.hash(
        req.body.password,
        passwordHashSaltRounds,
    )

    const userCreateInput: Prisma.UserCreateInput = {
        id: req.body.id,
        email: req.body.email,
        firstName: req.body.firstName,
        middleName: req.body.middleName ?? '',
        lastName: req.body.lastName ?? '',
        role: req.body.role,
    }

    logger.info('creating user...')
    const newUser = await prisma.user.create({ data: userCreateInput })
    logger.info('creating user done.')

    const secretCreateInput: Prisma.SecretCreateInput = {
        user: {
            connect: { id: req.body.id },
        },
        password: hashedPassword,
    }

    logger.info('creating secret...')
    await prisma.secret.create({ data: secretCreateInput })
    logger.info('creating secret done.')

    logger.info('create user request completed')

    return authController.createTokens(req, res, newUser.id)
}

export async function deleteUser(req: schema.DeleteUserRequest, res: Response) {
    logger.info(`delete user request recieved`)

    const userId = res.locals.user
    assert(userId)

    const user = await prisma.user.delete({ where: { id: userId } })

    if (!user) {
        logger.info('delete user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'user not found',
        })
    }

    logger.info(`delete user request completed`)

    return res.status(StatusCodes.OK).send({
        error: 'user deleted',
    })
}

export async function loginUser(req: schema.LoginUserRequest, res: Response) {
    logger.info('login user request recieved')

    const userId = req.body.id
    const password = req.body.password

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        logger.info('login user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'user not found',
        })
    }

    const secret = await prisma.secret.findUnique({
        where: { userId: userId },
    })

    if (!secret) {
        logger.info('login user request rejected, password not found')

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'password not found',
        })
    }

    const passwordMatched = await bcrypt.compare(password, secret.password)
    if (!passwordMatched) {
        logger.info('login user request rejected, password does not match')

        return res.status(StatusCodes.UNAUTHORIZED).send({
            error: 'password does not match',
        })
    }

    logger.info('login user request completed')

    return authController.createTokens(req, res, user.id)
}

export async function getUser(req: schema.GetUserRequest, res: Response) {
    const userId = res.locals.user
    assert(userId)

    logger.info(`get user request recieved, id:${userId}`)

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (user === null) {
        logger.info('get user request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'user not found',
        })
    }

    logger.info('get user request completed')

    return res.status(StatusCodes.OK).send({
        user: user,
    })
}

export async function getUsers(req: schema.GetUsersRequest, res: Response) {
    logger.info('get users request recieved')

    const userId = res.locals.user
    assert(userId)

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        logger.info('get users request rejected, user not found')

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'user not found',
        })
    }

    logger.info(`requesting users, from: ${req.query.from}, to: ${req.query.count}`)

    // we need to parse this as int, because zod is returning as string
    // this might me a big from zod side
    const from = parseInt(req.query.from) || undefined
    const count = parseInt(req.query.count) || undefined
    const countOnly = req.query.countOnly

    if (countOnly) {
        logger.info('user is requesting count only')

        const count = await prisma.user.count()

        logger.info('get users request completed')
        return res.status(StatusCodes.OK).send({
            count: count
        })
    }

    const users = await prisma.user.findMany({
        skip: from,
        take: count,
    })

    logger.info('get users request completed')
    return res.status(StatusCodes.OK).send({
        users,
    })
}

export default {
    createUser,
    deleteUser,
    loginUser,
    getUser,
    getUsers,
}
