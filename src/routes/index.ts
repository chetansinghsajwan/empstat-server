import { Router } from 'express'
import userRouter from '@routes/user'
import subjectRouter from '@routes/subject'
import trainingRouter from '@routes/training'
import assessementRouter from '@routes/assessment'

const router = Router()

router.use('/user', userRouter)
router.use('/subject', subjectRouter)
router.use('/training', trainingRouter)
router.use('/assessment', assessementRouter)

export default router
