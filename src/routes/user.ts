import { Router } from 'express'
import controller from '@controllers/user'
import authController from '@controllers/auth'
import schemas from '@schemas/user'

const router = Router()

router.post('', schemas.validateCreateUserRequest, controller.createUser)

router.delete(
    '',
    authController.validateAccessToken,
    schemas.validateDeleteUserRequest,
    controller.deleteUser,
)

router.post('/login', schemas.validateLoginUserRequest, controller.loginUser)

router.get(
    '',
    authController.validateAccessToken,
    schemas.validateGetUserRequest,
    controller.getUser,
)

router.get(
    '/all',
    authController.validateAccessToken,
    schemas.validateGetUsersRequest,
    controller.getUsers,
)

export default router
