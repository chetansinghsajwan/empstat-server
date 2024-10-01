import { Router } from 'express'
import controller from '../controllers/training'

const router = Router()

router.post('', controller.createTraining)
router.delete('', controller.deleteTraining)
router.put('', controller.updateTraining)
router.get('', controller.getTraining)
router.get('/all', controller.getTrainings)

export default router
