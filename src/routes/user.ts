import { Router } from 'express'
import controller from '../controllers/user'
import authController from '../controllers/auth'

const router = Router()

router.post('', controller.createUser)

router.delete(
    '',
    authController.validateAccessToken,
    controller.deleteUser
)

router.post('/login', controller.loginUser)

router.get(
    '',
    authController.validateAccessToken,
    controller.getUsers
)

router.get(
    '',
    authController.validateAccessToken,
    controller.getUser
)

export default router
