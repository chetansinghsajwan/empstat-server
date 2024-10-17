import { Router } from 'express'
import controller from '@controllers/assessment'
import authController from '@controllers/auth'
import schema from '@schemas/assessment'

const router = Router()

router.post(
    '',
    authController.validateAccessToken,
    schema.validateCreateAssessmentRequest,
    controller.createAssessment,
)

router.delete(
    '/:userId/:trainingId',
    authController.validateAccessToken,
    schema.validateDeleteAssessmentRequest,
    controller.deleteAssessment,
)

router.put(
    '/:userId/:trainingId',
    authController.validateAccessToken,
    schema.validateUpdateAssessmentRequest,
    controller.updateAssessment,
)

router.get(
    '/all',
    authController.validateAccessToken,
    schema.validateGetAssessmentsRequest,
    controller.getAssessments,
)

router.get(
    '/:userId/:trainingId',
    authController.validateAccessToken,
    schema.validateGetAssessmentRequest,
    controller.getAssessment,
)

export default router
