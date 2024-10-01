import { Request, Response } from 'express'

export async function createSubject(req: Request, res: Response) {}
export async function deleteSubject(req: Request, res: Response) {}
export async function updateSubject(req: Request, res: Response) {}
export async function getSubject(req: Request, res: Response) {}
export async function getSubjects(req: Request, res: Response) {}

export default {
    createSubject,
    deleteSubject,
    updateSubject,
    getSubject,
    getSubjects,
}
