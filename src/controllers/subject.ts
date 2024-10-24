import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utils/logging'
import prisma from '@modals'
import * as schema from '@schemas/subject'

export async function createSubject(
    req: schema.CreateSubjectRequest,
    res: Response,
) {
    logger.info('create subject request received')

    const { id, name, minMarks, maxMarks, totalTime } = req.body

    const existingSubject = await prisma.subject.findUnique({
        where: { id },
    })

    if (existingSubject !== null) {
        logger.info(
            'create subject request rejected, subject with this id already exists',
        )
        return res.status(StatusCodes.CONFLICT).send({
            error: 'subject with this id already exists',
        })
    }

    const subject = await prisma.subject.create({
        data: {
            id,
            name,
            minMarks,
            maxMarks,
            totalTime,
        },
    })

    logger.info('create subject request completed')
    return res.status(StatusCodes.CREATED).send({
        subject,
    })
}

export async function deleteSubject(
    req: schema.DeleteSubjectRequest,
    res: Response,
) {
    logger.info('delete subject request received')

    const ids = req.body.ids

    const subjects = await prisma.subject.deleteMany({
        where: { id: { in: ids } },
    })

    logger.info(`delete subject request completed, count: ${subjects.count}`)
    return res.status(StatusCodes.OK).send({
        count: subjects.count,
    })
}

export async function updateSubject(
    req: schema.UpdateSubjectRequest,
    res: Response,
) {
    logger.info('update subject request received')

    const { id } = req.params
    const { name, minMarks, maxMarks, totalTime } = req.body

    const subject = await prisma.subject.findUnique({
        where: { id },
    })

    if (!subject) {
        logger.info('update subject request rejected, subject not found')
        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'subject not found',
        })
    }

    const updatedSubject = await prisma.subject.update({
        where: { id },
        data: {
            name,
            minMarks,
            maxMarks,
            totalTime,
        },
    })

    logger.info('update subject request completed')
    return res.status(StatusCodes.OK).send({
        subject: updatedSubject,
    })
}

export async function getSubject(req: schema.GetSubjectRequest, res: Response) {
    logger.info('get subject request received')

    const { id } = req.params

    const subject = await prisma.subject.findUnique({
        where: { id },
    })

    if (!subject) {
        logger.info('get subject request rejected, subject not found')
        return res.status(StatusCodes.NOT_FOUND).send({
            error: 'subject not found',
        })
    }

    logger.info('get subject request completed')
    return res.status(StatusCodes.OK).send({
        subject,
    })
}

export async function getSubjects(
    req: schema.GetSubjectsRequest,
    res: Response,
) {
    logger.info('get subjects request received')

    logger.info(
        `requesting subjects, from: ${req.query.from}, to: ${req.query.count}`,
    )

    // we need to parse this as int, because zod is returning as string
    // this might me a big from zod side
    const from = parseInt(req.query.from) || undefined
    const count = parseInt(req.query.count) || undefined
    const countOnly = req.query.countOnly

    if (countOnly) {
        logger.info('user is requesting count only')

        const count = await prisma.subject.count()

        logger.info('get subjects request completed')
        return res.status(StatusCodes.OK).send({
            count: count,
        })
    }

    const subjects = await prisma.subject.findMany({
        skip: from,
        take: count,
    })

    logger.info('get subjects request completed')
    return res.status(StatusCodes.OK).send({
        subjects,
    })
}

export default {
    createSubject,
    deleteSubject,
    updateSubject,
    getSubject,
    getSubjects,
}
