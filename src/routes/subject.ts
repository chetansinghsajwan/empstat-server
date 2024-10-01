import { Router } from 'express'
import controller from '../controllers/subject'

const router = Router()

router.post('', controller.createSubject)
router.delete('', controller.deleteSubject)
router.put('', controller.updateSubject)
router.get('', controller.getSubject)
router.get('/all', controller.getSubjects)

export default router
