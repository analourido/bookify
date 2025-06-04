import { Router } from "express";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { ReadingListController } from "../controllers/readingList.controller";

const router = Router();

router.get("/", isAuthenticate, ReadingListController.getUserLists);
router.post("/", isAuthenticate, ReadingListController.createList);
router.delete("/:id", isAuthenticate, ReadingListController.deleteList);
router.put("/:id", isAuthenticate, ReadingListController.updateList);
router.post('/:id/books', isAuthenticate, ReadingListController.addBookToList)

export default router;
