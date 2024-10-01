import { Router } from 'express'
import userRouter from './user'
import subjectRouter from './subject'
import trainingRouter from './training'
import assessementRouter from './assessment'

const router = Router()

router.use('/user', userRouter)
router.use('/subject', subjectRouter)
router.use('/training', trainingRouter)
router.use('/assessment', assessementRouter)

export default router
