import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exceptions/httpException'
import { ReviewService } from '../services/review.services'
import { prisma } from '../database/database'

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const bookId = Number(req.params.bookId)
      const { content, rating } = req.body

      if (!userId || isNaN(bookId)) throw new HttpException(400, 'Parámetros inválidos')

      const review = await ReviewService.create(userId, bookId, content, rating)
      res.status(201).json(review)
    } catch (err) {
      next(err)
    }
  }

  static async getByBook(req: Request, res: Response, next: NextFunction) {
    try {
      const bookId = Number(req.params.bookId)
      if (isNaN(bookId)) throw new HttpException(400, 'ID de libro inválido')

      const reviews = await ReviewService.getByBook(bookId)
      res.status(200).json(reviews)
    } catch (err) {
      next(err)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { idBook, idUser } = req.params;
      const userId = req.user?.id;

      // Solo el propio autor de la reseña o un admin pueden eliminarla
      if (!userId) throw new HttpException(401, 'No autorizado');

      const review = await prisma.review.findUnique({
        where: { idUser_idBook: { idUser: Number(idUser), idBook: Number(idBook) } }
      });

      if (!review) throw new HttpException(404, 'Reseña no encontrada');

      if (review.idUser !== userId) {
        throw new HttpException(403, 'No autorizado para eliminar esta reseña');
      }

      await prisma.review.delete({
        where: { idUser_idBook: { idUser: Number(idUser), idBook: Number(idBook) } }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
