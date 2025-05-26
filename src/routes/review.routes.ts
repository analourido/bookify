import { Router } from 'express'
import { isAuthenticate } from '../middlewares/auth.middleware'
import { ValidationMiddleware } from '../middlewares/validation.middleware'
import { reviewValidation } from '../middlewares/validators.middleware'
import { ReviewController } from '../controllers/review.controller'

const router = Router()

router.post('/:bookId', isAuthenticate, reviewValidation, ValidationMiddleware, ReviewController.create)
router.get('/:bookId', ReviewController.getByBook)
router.delete('/:bookId', isAuthenticate, ReviewController.delete)

export default router
