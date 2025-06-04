import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";

export class ReadingHistoryController {
    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { bookId, status } = req.body;
            const userId = req.user?.id;
            if (!userId) throw new HttpException(401, "No autorizado");
            const existing = await prisma.readingHistory.findFirst({
                where: { idUser: userId, idBook: bookId }
            });

            if (existing) {
                await prisma.readingHistory.update({
                    where: { id: existing.id },
                    data: { status }
                });
            } else {
                await prisma.readingHistory.create({
                    data: { idUser: userId, idBook: bookId, status }
                });
            }

            res.status(200).json({ message: "Estado de lectura actualizado." });
        } catch (error) {
            next(error);
        }
    }

    static async getUserHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpException(401, "No autorizado");

            const history = await prisma.readingHistory.findMany({
                where: { idUser: userId },
                include: {
                    book: {
                        select: { id: true, title: true, author: true, coverUrl: true }
                    }
                },
                orderBy: { updatedAt: "desc" }
            });

            res.status(200).json(history);
        } catch (error) {
            next(error);
        }
    }
}
