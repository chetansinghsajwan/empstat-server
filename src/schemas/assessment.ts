import zod from 'zod'
import zodExpress from 'zod-express-middleware'
import { TypedRequest } from 'zod-express-middleware'
import userSchema from '@schemas/user'
import trainingSchema from '@schemas/training'

const body = {
    // user id
    userId: userSchema.id,

    // training id
    trainingId: trainingSchema.id,

    // marks
    marks: zod.number().min(0, 'minimum marks cannot be less than 0'),

    // was internet allowed during assessment
    internetAllowed: zod.boolean().default(false),
}

const createAssessment = {
    body: zod.object(body),
}

const deleteAssessment = {
    params: zod.object({
        userId: body.userId,
        trainingId: body.trainingId,
    }),
}

const updateAssessment = {
    params: zod.object({
        userId: body.userId,
        trainingId: body.trainingId,
    }),

    body: zod.object(body),
}

const getAssessment = {
    params: zod.object({
        userId: body.userId,
        trainingId: body.trainingId,
    }),
}

const getAssessments = {
    query: zod.object({
        userId: body.userId.optional(),
        trainingId: body.trainingId.optional(),
        from: zod.coerce.number().min(0, 'from cannot be less than 0').optional(),
        count: zod.coerce.number().min(0, 'count cannot be less than 0').optional(),
        countOnly: zod.coerce.boolean().optional(),
    }),
}

const validateCreateAssessmentRequest =
    zodExpress.validateRequest(createAssessment)
const validateDeleteAssessmentRequest =
    zodExpress.validateRequest(deleteAssessment)
const validateUpdateAssessmentRequest =
    zodExpress.validateRequest(updateAssessment)
const validateGetAssessmentRequest = zodExpress.validateRequest(getAssessment)
const validateGetAssessmentsRequest = zodExpress.validateRequest(getAssessments)

export type CreateAssessmentRequest = TypedRequest<any, any, typeof createAssessment.body>
export type DeleteAssessmentRequest = TypedRequest<typeof deleteAssessment.params, any, any>
export type UpdateAssessmentRequest = TypedRequest<typeof updateAssessment.params, any, typeof updateAssessment.body>
export type GetAssessmentRequest = TypedRequest<typeof getAssessment.params, any, any>
export type GetAssessmentsRequest = TypedRequest<any, typeof getAssessments.query, any>

export default {
    createAssessment,
    deleteAssessment,
    updateAssessment,
    getAssessment,
    getAssessments,

    validateCreateAssessmentRequest,
    validateDeleteAssessmentRequest,
    validateUpdateAssessmentRequest,
    validateGetAssessmentRequest,
    validateGetAssessmentsRequest,
}
