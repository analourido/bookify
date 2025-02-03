import { Router } from "express";
import { AuthController } from '../controllers/auth.controllers'
import { loginValidation, registerValidation } from '../middlewares/validators.middleware'
import { ValidationMiddleware } from '../middlewares/validation.middleware'
const router = Router()

router.post('/login', loginValidation, ValidationMiddleware, AuthController.login)
// router.post('/logout', AuthController.logout)
router.post('/register', registerValidation, ValidationMiddleware, AuthController.register)

export default router