import { Router } from "express";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { ReadingHistoryController } from "../controllers/readingHistory.controller";

const router = Router();

router.post("/update", isAuthenticate, ReadingHistoryController.updateStatus);
router.get("/user", isAuthenticate, ReadingHistoryController.getUserHistory);

export default router;
