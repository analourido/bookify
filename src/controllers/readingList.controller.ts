import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { ReadingListService } from "../services/readingList.service";

export class ReadingListController {
    static async getUserLists(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const lists = await prisma.readingList.findMany({
                where: { idUser: userId },
                include: { books: { include: { book: true } } }
            });
            res.status(200).json(lists);
        } catch (error) {
            next(error);
        }
    }

    static async createList(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const { name } = req.body;
            const newList = await prisma.readingList.create({
                data: { name, idUser: userId }
            });
            res.status(201).json(newList);
        } catch (error) {
            next(error);
        }
    }

    static async deleteList(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await prisma.readingList.delete({ where: { id } });
            res.status(200).json({ message: "Lista eliminada" });
        } catch (error) {
            next(error);
        }
    }

    static async updateList(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;
            const updatedList = await prisma.readingList.update({
                where: { id },
                data: { name }
            });
            res.status(200).json(updatedList);
        } catch (error) {
            next(error);
        }
    }

    static async addBookToList(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const listId = Number(req.params.id)
            const { bookId } = req.body
            const added = await ReadingListService.addBookToList(listId, bookId, userId)
            res.status(200).json(added)
        } catch (error) {
            next(error)
        }
    }


}
