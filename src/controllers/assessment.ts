import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utils/logging'
import prisma from '@modals'
import * as schema from '@schemas/assessment'

export async function createAssessment(req: schema.CreateAssessmentRequest, res: Response) {
    logger.info('create assessment request recieved')

    const { userId, trainingId, marks, internetAllowed } = req.body

    const existingUser = prisma.user.findUnique({
        where: { id: userId },
    })
    if (!existingUser) {
        logger.info('create assessment request rejected, user not found')

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'user does not exist',
        })
    }

    const existingTraining = prisma.training.findUnique({
        where: { id: trainingId },
    })
    if (!existingTraining) {
        logger.info('create assessment request rejected, training not found')

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'training does not exist',
        })
    }

    const newAssessment = await prisma.assessment.create({
        data: {
            userId,
            trainingId,
            marks,
            internetAllowed,
        },
    })

    logger.info('create assessment request completed.')

    return res.status(StatusCodes.CREATED).send({
        assessment: {
            userId: newAssessment.userId,
            trainingId: newAssessment.trainingId,
        },
    })
}

export async function deleteAssessment(req: schema.DeleteAssessmentRequest, res: Response) {
    logger.info('delete assessment request recieved')

    const { userId, trainingId } = req.params

    const deletedAssessment = await prisma.assessment.delete({
        where: {
            userId_trainingId: {
                userId,
                trainingId,
            },
        },
    })

    if (!deletedAssessment) {
        logger.info(
            'delete assessment request rejected, assessment does not exist',
        )

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'assessment does not exist',
        })
    }

    logger.info('delete assessment request completed')
    return res.status(StatusCodes.OK).send()
}

export async function updateAssessment(req: schema.UpdateAssessmentRequest, res: Response) {
    logger.info('update assessment request recieved')

    const { userId, trainingId } = req.params
    const { marks, internetAllowed } = req.body

    const existingAssessment = await prisma.assessment.findUnique({
        where: {
            userId_trainingId: {
                userId: userId,
                trainingId: trainingId,
            },
        },
    })

    if (!existingAssessment) {
        logger.info('update assessment request rejected, assessment not found')

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'assessment not found',
        })
    }

    const updatedAssessment = await prisma.assessment.update({
        where: {
            userId_trainingId: {
                userId,
                trainingId,
            },
        },
        data: {
            marks,
            internetAllowed,
        },
    })

    logger.info('update assessment request completed')

    return res.status(StatusCodes.OK).send({
        assessment: {
            userId: updatedAssessment.userId,
            trainingId: updatedAssessment.trainingId,
        },
    })
}

export async function getAssessment(req: schema.GetAssessmentRequest, res: Response) {
    logger.info('get assessment request received')

    const { userId, trainingId } = req.params

    const assessment = await prisma.assessment.findUnique({
        where: {
            userId_trainingId: {
                userId,
                trainingId,
            },
        },
    })

    if (!assessment) {
        logger.info('get assessment request rejected, assessment not found')

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'assessment not found.',
        })
    }

    logger.info('get assessment request completed')
    return res.status(StatusCodes.OK).send({
        assessment: assessment,
    })
}

export async function getAssessments(req: schema.GetAssessmentsRequest, res: Response) {
    logger.info('get assessments request received')

    const { userId, trainingId } = req.query

    // we need to parse this as int, because zod is returning as string
    // this might me a big from zod side
    const from = parseInt(req.query.from) || undefined
    const count = parseInt(req.query.count) || undefined
    const countOnly = req.query.countOnly

    if (countOnly) {
        logger.info('user is requesting count only')

        const count = await prisma.assessment.count()

        logger.info('get assessments request completed')
        return res.status(StatusCodes.OK).send({
            count: count
        })
    }

    logger.info(`requesting assessments, from: ${req.query.from}, to: ${req.query.count}`)

    const assessments = await prisma.assessment.findMany({
        where: {
            ...(userId ? { userId: String(userId) } : {}),
            ...(trainingId ? { trainingId: String(trainingId) } : {}),
        },
        skip: from,
        take: count
    })

    logger.info('get assessments request completed')

    return res.status(StatusCodes.OK).send({
        assessments: assessments,
    })
}

export default {
    createAssessment,
    deleteAssessment,
    updateAssessment,
    getAssessment,
    getAssessments,
}
