import { Router } from 'express'
import userRouter from './user'
import subjectRouter from './subject'
import trainingRouter from './training'

const router = Router()

router.use(userRouter)
router.use(trainingRouter)
router.use(subjectRouter)

export default router
