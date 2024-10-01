import { Request, Response } from 'express'

export async function createTraining(req: Request, res: Response) {}
export async function deleteTraining(req: Request, res: Response) {}
export async function updateTraining(req: Request, res: Response) {}
export async function getTraining(req: Request, res: Response) {}
export async function getTrainings(req: Request, res: Response) {}

export default {
    createTraining,
    deleteTraining,
    updateTraining,
    getTraining,
    getTrainings,
}
