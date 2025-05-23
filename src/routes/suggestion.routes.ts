import { Router } from "express";
import { SuggestionController } from "../controllers/suggestion.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { suggestionValidation } from "../middlewares/validators.middleware";

const router = Router();

router.get("/", isAuthenticate, SuggestionController.getAll);
router.get("/:id", isAuthenticate, SuggestionController.getById);
router.post("/", isAuthenticate, suggestionValidation, ValidationMiddleware, SuggestionController.create);
router.put("/:id", isAuthenticate, isAdmin, suggestionValidation, ValidationMiddleware, SuggestionController.update);
router.delete("/:id", isAuthenticate, isAdmin, SuggestionController.delete);

export default router;