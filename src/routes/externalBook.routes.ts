import { Router } from 'express'
import { ExternalBookController } from '../controllers/externalBook.controller'
import { isAuthenticate } from '../middlewares/auth.middleware'

const router = Router()

router.get('/search', isAuthenticate, ExternalBookController.search)

export default router
