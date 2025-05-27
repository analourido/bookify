import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'

export class ReviewService {

    static async create(userId: number, bookId: number, content: string, rating: number) {
        // prevenir reseñas duplicadas por usuario
        const existing = await prisma.review.findFirst({
            where: { idUser: userId, idBook: bookId }
        });

        if (existing) {
            throw new HttpException(400, "Ya has escrito una reseña para este libro");
        }

        return await prisma.review.create({
            data: {
                idUser: userId,
                idBook: bookId,
                content,
                rating
            }
        });
    }


    static async getByBook(bookId: number) {
        return prisma.review.findMany({
            where: { idBook: bookId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, surname: true } }
            }
        })
    }

    static async delete(userId: number, bookId: number) {
        const review = await prisma.review.findUnique({
            where: { idUser_idBook: { idUser: userId, idBook: bookId } }
        })
        if (!review) throw new HttpException(404, 'Reseña no encontrada')
        if (review.idUser !== userId) throw new HttpException(403, 'No autorizado')

        return prisma.review.delete({
            where: { idUser_idBook: { idUser: userId, idBook: bookId } }
        })
    }
}
