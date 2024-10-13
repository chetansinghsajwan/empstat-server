import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utils/logging'
import db from '@modals'

export async function createAssessment(req: Request, res: Response) {
    const { userId, trainingId, marks, internetAllowed } = req.body

    try {
        const newAssessment = await db.assessment.create({
            data: {
                userId,
                trainingId,
                marks,
                internetAllowed,
            },
        })

        logger.info(
            `Assessment created: User: ${userId}, Training: ${trainingId}`,
        )
        return res.status(StatusCodes.CREATED).json(newAssessment)
    } catch (error) {
        logger.error('Error creating assessment:', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Error creating assessment.')
    }
}

export async function deleteAssessment(req: Request, res: Response) {
    const { userId, trainingId } = req.params

    try {
        await db.assessment.delete({
            where: {
                userId_trainingId: {
                    userId,
                    trainingId,
                },
            },
        })

        logger.info(
            `Assessment deleted: User: ${userId}, Training: ${trainingId}`,
        )
        return res.status(StatusCodes.NO_CONTENT).send()
    } catch (error) {
        logger.error('Error deleting assessment:', error)
        return res.status(StatusCodes.NOT_FOUND).send('Assessment not found.')
    }
}

export async function updateAssessment(req: Request, res: Response) {
    const { userId, trainingId } = req.params
    const { marks, internetAllowed } = req.body

    try {
        const updatedAssessment = await db.assessment.update({
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

        logger.info(
            `Assessment updated: User: ${userId}, Training: ${trainingId}`,
        )
        return res.status(StatusCodes.OK).json(updatedAssessment)
    } catch (error) {
        logger.error('Error updating assessment:', error)
        return res.status(StatusCodes.NOT_FOUND).send('Assessment not found.')
    }
}

export async function getAssessment(req: Request, res: Response) {
    const { userId, trainingId } = req.params

    try {
        const assessment = await db.assessment.findUnique({
            where: {
                userId_trainingId: {
                    userId,
                    trainingId,
                },
            },
        })

        if (!assessment) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send('Assessment not found.')
        }

        return res.status(StatusCodes.OK).json(assessment)
    } catch (error) {
        logger.error('Error retrieving assessment:', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Error retrieving assessment.')
    }
}

export async function getAssessments(req: Request, res: Response) {
    const { userId, trainingId } = req.query

    try {
        const assessments = await db.assessment.findMany({
            where: {
                ...(userId ? { userId: String(userId) } : {}),
                ...(trainingId ? { trainingId: String(trainingId) } : {}),
            },
        })

        return res.status(StatusCodes.OK).json(assessments)
    } catch (error) {
        logger.error('Error retrieving assessments:', error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send('Error retrieving assessments.')
    }
}

export default {
    createAssessment,
    deleteAssessment,
    updateAssessment,
    getAssessment,
    getAssessments,
}
