import { Router } from 'express'
import controller from '@controllers/training'
import authController from '@controllers/auth'
import schema from '@schemas/training'

const router = Router()

router.post(
    '',
    authController.validateAccessToken,
    schema.validateCreateTrainingRequest,
    controller.createTraining,
)

router.delete(
    '/:id',
    authController.validateAccessToken,
    schema.validateDeleteTrainingRequest,
    controller.deleteTraining,
)

router.put(
    '/:id',
    authController.validateAccessToken,
    schema.validateUpdateTrainingRequest,
    controller.updateTraining,
)

router.get(
    '/all',
    authController.validateAccessToken,
    schema.validateGetTrainingsRequest,
    controller.getTrainings,
)

router.get(
    '/:id',
    authController.validateAccessToken,
    schema.validateGetTrainingRequest,
    controller.getTraining,
)

export default router
