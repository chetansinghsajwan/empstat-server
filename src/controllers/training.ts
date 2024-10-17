import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utils/logging'
import prisma from '@modals'

export async function createTraining(req: Request, res: Response) {
    const { id, name, mode, subject, startedAt, endedAt } = req.body

    try {
        const existingSubject = await prisma.subject.findUnique({
            where: { id: subject },
        })

        if (!existingSubject) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send('Invalid subject ID.')
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

        logger.info(`Training created: ${newTraining.id}`)
        return res.status(StatusCodes.CREATED).json(newTraining)
    } catch (error) {
        logger.error('Error creating training:', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Error creating training.')
    }
}

export async function deleteTraining(req: Request, res: Response) {
    const { id } = req.params

    try {
        const training = await prisma.training.delete({
            where: { id },
        })

        logger.info(`Training deleted: ${training.id}`)
        return res.status(StatusCodes.OK).send('Training deleted successfully.')
    } catch (error) {
        logger.error('Error deleting training:', error)
        return res.status(StatusCodes.NOT_FOUND).send('Training not found.')
    }
}

export async function updateTraining(req: Request, res: Response) {
    const { id } = req.params
    const { name, mode, subject, startedAt, endedAt } = req.body

    try {
        const existingSubject = await prisma.subject.findUnique({
            where: { id: subject },
        })

        if (!existingSubject) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send('Invalid subject ID.')
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

        logger.info(`Training updated: ${updatedTraining.id}`)
        return res.status(StatusCodes.OK).json(updatedTraining)
    } catch (error) {
        logger.error('Error updating training:', error)
        return res.status(StatusCodes.NOT_FOUND).send('Training not found.')
    }
}

export async function getTraining(req: Request, res: Response) {
    const { id } = req.params

    try {
        const training = await prisma.training.findUnique({
            where: { id },
        })

        if (!training) {
            return res.status(StatusCodes.NOT_FOUND).send('Training not found.')
        }

        return res.status(StatusCodes.OK).json(training)
    } catch (error) {
        logger.error('Error retrieving training:', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Error retrieving training.')
    }
}

export async function getTrainings(req: Request, res: Response) {
    try {
        const trainings = await prisma.training.findMany()

        return res.status(StatusCodes.OK).json(trainings)
    } catch (error) {
        logger.error('Error retrieving trainings:', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Error retrieving trainings.')
    }
}

export default {
    createTraining,
    deleteTraining,
    updateTraining,
    getTraining,
    getTrainings,
}
