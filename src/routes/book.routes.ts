import { Router } from "express";
import { bookValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { BookController } from "../controllers/book.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router()

router.get('/', isAuthenticate, BookController.getAll)
router.get('/:id', isAuthenticate, BookController.getById)
router.post('/', isAuthenticate, isAdmin, bookValidation, ValidationMiddleware, BookController.create)
router.delete('/:id', isAuthenticate, isAdmin, BookController.delete)
router.put('/:id', isAuthenticate, isAdmin, bookValidation, ValidationMiddleware, BookController.update)

export default router