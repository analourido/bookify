import { Request, Response, NextFunction } from 'express'
import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'
import { StatisticsService } from '../services/statistics.service'

export class StatisticsController {
    static async getGlobalStats(req: Request, res: Response, next: NextFunction) {
        try {
            const totalUsers = await prisma.user.count()
            const totalBooks = await prisma.book.count()
            const totalClubs = await prisma.club.count()
            const totalReviews = await prisma.review.count()

            res.json({ totalUsers, totalBooks, totalClubs, totalReviews })
        } catch (error) {
            next(error)
        }
    }

    static async getClubStats(req: Request, res: Response, next: NextFunction) {
        try {
            const clubId = Number(req.params.id);
            if (isNaN(clubId)) {
                res.status(400).json({ message: 'ID de club inválido' });
                return;
            }
            const stats = await StatisticsService.getClubStatistics(clubId);
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    }

    static async getUserStats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }
            const stats = await StatisticsService.getUserStatistics(userId);
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    }

}
