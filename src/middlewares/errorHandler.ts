import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export default function Handler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.error('error: ' + err)
    console.trace()

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
}
