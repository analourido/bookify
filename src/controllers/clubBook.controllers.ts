import { Request, Response, NextFunction } from 'express'
import { ClubBookService } from '../services/clubBook.service'
import { HttpException } from '../exceptions/httpException'
import { notifyClubMembers } from '../utils/notify.util'
import { prisma } from '../database/database'

export class ClubBookController {
  static async addBook(req: Request, res: Response, next: NextFunction) {
    try {
      const clubId = Number(req.params.id)
      const userId = req.user?.id
      const bookId = Number(req.body.bookId)

      if (isNaN(clubId)) throw new HttpException(400, 'ID de club inválido')
      if (!userId) throw new HttpException(401, 'No autorizado')
      if (isNaN(bookId)) throw new HttpException(400, 'bookId inválido')

      const clubBook = await ClubBookService.addBook(clubId, userId, bookId)

      // Obtenemos solo los datos necesarios para el mensaje
      const [user, club, book] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
        prisma.club.findUnique({ where: { id: clubId }, select: { name: true } }),
        prisma.book.findUnique({ where: { id: bookId }, select: { title: true } })
      ])

      if (user && club && book) {
        await notifyClubMembers(
          clubId,
          `"${user.name}" ha propuesto el libro "${book.title}" en el club "${club.name}"`
        )
      }

      res.status(201).json(clubBook)
    } catch (error) {
      next(error)
    }
  }

  static async listBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const clubId = Number(req.params.id)
      if (isNaN(clubId)) throw new HttpException(400, 'ID de club inválido')

      const userId = req.user?.id
      if (!userId) throw new HttpException(401, 'No autorizado')

      const list = await ClubBookService.listBooks(clubId, userId)
      res.status(200).json(list)
    } catch (error) {
      next(error)
    }
  }

  static async selectBook(req: Request, res: Response, next: NextFunction) {
    try {
      const clubId = Number(req.params.id)
      const bookId = Number(req.params.bookId)
      if (isNaN(clubId) || isNaN(bookId)) {
        throw new HttpException(400, 'IDs inválidos')
      }

      const userId = req.user?.id
      if (!userId) throw new HttpException(401, 'No autorizado')

      const selected = await ClubBookService.selectBook(clubId, userId, bookId)

      // Obtenemos solo los datos necesarios para el mensaje
      const [user, club, book] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
        prisma.club.findUnique({ where: { id: clubId }, select: { name: true } }),
        prisma.book.findUnique({ where: { id: bookId }, select: { title: true } })
      ])

      if (user && club && book) {
        await notifyClubMembers(
          clubId,
          `"${user.name}" ha propuesto el libro "${book.title}" en el club "${club.name}"`
        )
      }
      res.status(200).json(selected)
    } catch (error) {
      next(error)
    }
  }

}
