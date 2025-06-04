import { Router } from 'express'
import { StatisticsController } from '../controllers/statistics.controller'
import { isAuthenticate } from '../middlewares/auth.middleware'

const router = Router()

router.get('/global', isAuthenticate, StatisticsController.getGlobalStats)

export default router
