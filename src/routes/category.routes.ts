import { isAuthenticate } from "../middlewares/auth.middleware";
import { CategoryController } from "../controllers/category.controllers";
import { BookController } from "../controllers/book.controller";
import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { categoryValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
const router = Router();

router.get("/", isAuthenticate, CategoryController.getAll);
router.get("/:id", isAuthenticate, CategoryController.getById);
router.post("/", isAuthenticate, isAdmin, categoryValidation, ValidationMiddleware, CategoryController.create);
router.put("/:id", isAuthenticate, isAdmin, categoryValidation, ValidationMiddleware, CategoryController.update);
router.delete("/:id", isAuthenticate, isAdmin, CategoryController.delete);

export default router;