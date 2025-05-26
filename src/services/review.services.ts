import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'

export class ReviewService {

  static async create(userId: number, bookId: number, content: string, rating: number) {
    return prisma.review.create({
      data: {
        idUser: userId,
        idBook: bookId,
        content,
        rating,
      }
    })
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
