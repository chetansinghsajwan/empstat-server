import zod from 'zod'
import * as zodExpress from 'zod-express-middleware'
import subjectSchema from '@schemas/subject'

const mode = zod.enum(['online', 'offline', 'onsite'])

const id = zod.string().min(1, 'id cannot be empty').trim().toLowerCase()

const body = {
    // training id
    id: id,

    // training name
    name: zod.string().min(1, 'name cannot be empty').trim(),

    // minimum number of marks a user can get
    mode: mode,

    // id of the subject this training is of
    subject: subjectSchema.body.id,

    // time when training was started
    startedAt: zod.string().datetime().min(0, 'time should be greater than now'),

    // time when training was ended
    endedAt: zod.string().datetime().min(0, 'time should be greater than now'),
}

const createTraining = {
    body: zod.object(body),
}

const deleteTraining = {
    params: zod.object({
        // training id
        id: body.id,
    }),
}

const updateTraining = {
    params: zod.object({
        // training id
        id: body.id,
    }),

    body: zod.object(body),
}

const getTraining = {
    params: zod.object({
        // training id
        id: body.id,
    }),
}

const getTrainings = {}

const validateCreateTrainingRequest = zodExpress.validateRequest(createTraining)
const validateDeleteTrainingRequest = zodExpress.validateRequest(deleteTraining)
const validateUpdateTrainingRequest = zodExpress.validateRequest(updateTraining)
const validateGetTrainingRequest = zodExpress.validateRequest(getTraining)
const validateGetTrainingsRequest = zodExpress.validateRequest(getTrainings)

export default {
    id,

    createTraining,
    deleteTraining,
    updateTraining,
    getTraining,
    getTrainings,

    validateCreateTrainingRequest,
    validateDeleteTrainingRequest,
    validateUpdateTrainingRequest,
    validateGetTrainingRequest,
    validateGetTrainingsRequest,
}
