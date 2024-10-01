import { Router } from 'express'
import controller from '../controllers/assessment'
import authController from '../controllers/auth'
import schema from '../schemas/assessment'

const router = Router()

router.post('',
    authController.validateAccessToken,
    schema.validateCreateAssessmentRequest,
    controller.createAssessment
)

router.delete('/:id',
    authController.validateAccessToken,
    schema.validateDeleteAssessmentRequest,
    controller.deleteAssessment
)

router.put('/:id',
    authController.validateAccessToken,
    schema.validateUpdateAssessmentRequest,
    controller.updateAssessment
)

router.get('/:id',
    authController.validateAccessToken,
    schema.validateGetAssessmentRequest,
    controller.getAssessment
)

router.get('/all',
    authController.validateAccessToken,
    schema.validateGetAssessmentsRequest,
    controller.getAssessments
)

export default router
