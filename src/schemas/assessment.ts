import zod from 'zod'
import * as zodExpress from 'zod-express-middleware'
import userSchema from './user'
import trainingSchema from './training'

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
    })
}

const updateAssessment = {

    params: zod.object({

        userId: body.userId,
        trainingId: body.trainingId,
    }),

    body: zod.object(body)
}

const getAssessment = {

    params: zod.object({

        userId: body.userId,
        trainingId: body.trainingId,
    })
}

const getAssessments = {

    query: zod.object({

        userId: body.userId.optional(),
        trainingId: body.trainingId.optional(),
    })
}

const validateCreateAssessmentRequest = zodExpress.validateRequest(createAssessment)
const validateDeleteAssessmentRequest = zodExpress.validateRequest(deleteAssessment)
const validateUpdateAssessmentRequest = zodExpress.validateRequest(updateAssessment)
const validateGetAssessmentRequest = zodExpress.validateRequest(getAssessment)
const validateGetAssessmentsRequest = zodExpress.validateRequest(getAssessments)

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
