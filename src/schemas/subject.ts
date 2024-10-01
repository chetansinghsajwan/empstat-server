import zod from 'zod'
import * as zodExpress from 'zod-express-middleware'

const body = {
    // subject id
    id: zod.string().min(1, 'id cannot be empty').trim().toLowerCase(),

    // subject name
    name: zod.string().min(1, 'name cannot be empty').trim(),

    // minimum number of marks a user can get
    minMarks: zod.number().min(0, 'minimum marks cannot be less than 0'),

    // maximum number of marks a user can get
    //
    // @todo this should be greater than or equal to minMarks
    maxMarks: zod.number().min(0, 'maximum marks cannot be less than 0'),

    // total time it takes to complete the subject in minutes
    totalTime: zod.number().min(0, 'total time cannot be less than 0'),
}

export const createSubject = {
    body: zod.object(body),
}

export const deleteSubject = {
    params: zod.object({
        // subject id
        id: body.id,
    }),
}

export const updateSubject = {
    params: zod.object({
        // subject id
        id: body.id,
    }),

    body: zod.object(body),
}

export const getSubject = {
    params: zod.object({
        // subject id
        id: body.id,
    }),
}

export const getSubjects = {}

export const validateCreateSubjectRequest =
    zodExpress.validateRequest(createSubject)
export const validateDeleteSubjectRequest =
    zodExpress.validateRequest(deleteSubject)
export const validateUpdateSubjectRequest =
    zodExpress.validateRequest(updateSubject)
export const validateGetSubjectRequest = zodExpress.validateRequest(getSubject)
export const validateGetSubjectsRequest =
    zodExpress.validateRequest(getSubjects)

export default {
    body,

    createSubject,
    deleteSubject,
    updateSubject,
    getSubject,
    getSubjects,

    validateCreateSubjectRequest,
    validateDeleteSubjectRequest,
    validateUpdateSubjectRequest,
    validateGetSubjectRequest,
    validateGetSubjectsRequest,
}
