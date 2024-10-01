import { Router } from 'express'
import controller from '../controllers/subject'

const router = Router()

router.post('', controller.createSubject)
router.delete('/:id', controller.deleteSubject)
router.put('/:id', controller.updateSubject)
router.get('/:id', controller.getSubject)
router.get('/all', controller.getSubjects)

export default router
