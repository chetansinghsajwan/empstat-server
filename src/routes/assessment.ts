import { Router } from 'express'
import controller from '../controllers/assessment'

const router = Router()

router.post('', controller.createAssessment)
router.delete('/:userId:trainingId', controller.deleteAssessment)
router.put('/:userId:trainingId', controller.updateAssessment)
router.get('/:userId:trainingId', controller.getAssessment)
router.get('/:userId?:trainingId?', controller.getAssessments)

export default router
