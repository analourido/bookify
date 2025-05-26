import { Router } from "express";
import { bookImportValidation, bookValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { BookController } from "../controllers/book.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { ExternalBookController } from "../controllers/externalBook.controller";

const router = Router()

router.get('/', isAuthenticate, BookController.getAll)
router.get('/search', isAuthenticate, ExternalBookController.search)
router.get('/:id', isAuthenticate, BookController.getById)
router.post( '/import', isAuthenticate, bookImportValidation, ValidationMiddleware, BookController.create)
router.post('/', isAuthenticate, isAdmin, bookValidation, ValidationMiddleware, BookController.create)
router.delete('/:id', isAuthenticate, isAdmin, BookController.delete)
router.put('/:id', isAuthenticate, isAdmin, bookValidation, ValidationMiddleware, BookController.update)

export default router