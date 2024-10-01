import { Request, Response } from 'express'

export async function createAssessment(req: Request, res: Response) {}
export async function deleteAssessment(req: Request, res: Response) {}
export async function updateAssessment(req: Request, res: Response) {}
export async function getAssessment(req: Request, res: Response) {}
export async function getAssessments(req: Request, res: Response) {}

export default {
    createAssessment,
    deleteAssessment,
    updateAssessment,
    getAssessment,
    getAssessments,
}
