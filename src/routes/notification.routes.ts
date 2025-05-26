import { Router } from 'express'
import { NotificationController } from '../controllers/notification.controller'
import { isAuthenticate } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', isAuthenticate, NotificationController.getAll)
router.patch('/:id/read', isAuthenticate, NotificationController.markAsRead)

export default router
