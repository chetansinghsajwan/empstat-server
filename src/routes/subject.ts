import { Router } from 'express'
import controller from '@controllers/subject'
import authController from '@controllers/auth'
import schema from '@schemas/subject'

const router = Router()

router.post(
    '',
    authController.validateAccessToken,
    schema.validateCreateSubjectRequest,
    controller.createSubject,
)

router.delete(
    '',
    authController.validateAccessToken,
    schema.validateDeleteSubjectRequest,
    controller.deleteSubject,
)

router.put(
    '/:id',
    authController.validateAccessToken,
    schema.validateUpdateSubjectRequest,
    controller.updateSubject,
)

router.get(
    '/all',
    authController.validateAccessToken,
    schema.validateGetSubjectsRequest,
    controller.getSubjects,
)

router.get(
    '/:id',
    authController.validateAccessToken,
    schema.validateGetSubjectRequest,
    controller.getSubject,
)

export default router
