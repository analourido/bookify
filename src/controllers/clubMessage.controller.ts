import { Request, Response, NextFunction } from "express"
import { ClubMessageService } from "../services/clubMessage.service"
import { HttpException } from "../exceptions/httpException"

export class ClubMessageController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const clubId = Number(req.params.id)
      const { message } = req.body

      if (!userId || isNaN(clubId) || !message) {
        throw new HttpException(400, 'Parámetros inválidos')
      }

      const newMessage = await ClubMessageService.create(clubId, userId, message)
      res.status(201).json(newMessage)
    } catch (err) {
      next(err)
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const clubId = Number(req.params.id)
      if (isNaN(clubId)) throw new HttpException(400, 'ID inválido')

      const messages = await ClubMessageService.getAll(clubId)
      res.status(200).json(messages)
    } catch (err) {
      next(err)
    }
  }
}
