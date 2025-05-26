import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exceptions/httpException'
import { ReviewService } from '../services/review.services'

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
      const userId = req.user?.id
      const bookId = Number(req.params.bookId)

      if (!userId || isNaN(bookId)) throw new HttpException(400, 'Parámetros inválidos')

      const deleted = await ReviewService.delete(userId, bookId)
      res.status(200).json(deleted)
    } catch (err) {
      next(err)
    }
  }
}
