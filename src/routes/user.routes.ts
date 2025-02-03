import { Router } from "express";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controllers";
import { isAdmin } from "../middlewares/isAdmin.middleware";
const router = Router()


    
router.get('/profile', isAuthenticate , UserController.profile)
//router.get('/', isAuthenticate , UserController.profile)
//GET localhot:3000/api/users/
router.get('/', isAuthenticate, isAdmin , UserController.getAll)

export default router