import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utils/logging'
import prisma from '@modals'
import * as schema from '@schemas/training'

export async function createTraining(req: schema.CreateTrainingRequest, res: Response) {
    logger.info('create training request recieved.')

    const { id, name, mode, subject, startedAt, endedAt } = req.body

    const existingSubject = await prisma.subject.findUnique({
        where: { id: subject },
    })

    if (!existingSubject) {
        logger.info('create training request rejected, subject does not exist.')

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'subject does not exist',
        })
    }

    const newTraining = await prisma.training.create({
        data: {
            id,
            name,
            mode,
            subjectId: subject,
            startedAt,
            endedAt,
        },
    })

    logger.info(`create training request completed.`)
    return res.status(StatusCodes.CREATED).json(newTraining)
}

export async function deleteTraining(req: schema.DeleteTrainingRequest, res: Response) {
    logger.info(`delete training request received.`)

    const { id } = req.params

    const training = await prisma.training.delete({
        where: { id },
    })

    if (!training) {
        logger.info(
            'delete trainin request rejected, training does not exsist.',
        )

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'training does not exist',
        })
    }

    logger.info(`delete training request completed.`)
    return res.status(StatusCodes.OK).send({
        training: training.id,
    })
}

export async function updateTraining(req: schema.UpdateTrainingRequest, res: Response) {
    logger.info(`update training request received.`)

    const { id } = req.params
    const { name, mode, subject, startedAt, endedAt } = req.body

    const existingSubject = await prisma.subject.findUnique({
        where: { id: subject },
    })

    if (!existingSubject) {
        logger.info(
            `update training request rejected, training does not exist.`,
        )

        return res.status(StatusCodes.BAD_REQUEST).send({
            error: 'training does not exist',
        })
    }

    const updatedTraining = await prisma.training.update({
        where: { id },
        data: {
            name,
            mode,
            subjectId: subject,
            startedAt,
            endedAt,
        },
    })

    logger.info(`update training request completed.`)

    return res.status(StatusCodes.OK).json({
        training: updatedTraining.id,
    })
}

export async function getTraining(req: schema.GetTrainingRequest, res: Response) {
    logger.info(`get training request received.`)

    const { id } = req.params

    const training = await prisma.training.findUnique({
        where: { id },
    })

    if (!training) {
        logger.info(`get training request rejected, training does not exist.`)

        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'training does not exist',
        })
    }

    logger.info(`get training request completed.`)

    return res.status(StatusCodes.OK).json(training)
}

export async function getTrainings(req: schema.GetTrainingsRequest, res: Response) {
    const trainings = await prisma.training.findMany()

    return res.status(StatusCodes.OK).json({
        trainings: trainings,
    })
}

export default {
    createTraining,
    deleteTraining,
    updateTraining,
    getTraining,
    getTrainings,
}
