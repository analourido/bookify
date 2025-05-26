import { Request, Response, NextFunction } from 'express'
import { NotificationService } from '../services/notification.service'
import { HttpException } from '../exceptions/httpException'

export class NotificationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user?.id
      if (!idUser) throw new HttpException(401, 'No autorizado')

      const notifs = await NotificationService.getAll(idUser)
      res.status(200).json(notifs)
    } catch (err) {
      next(err)
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user?.id
      const notificationId = Number(req.params.id)
      if (!idUser || isNaN(notificationId)) throw new HttpException(400, 'ID inválido')

      const updated = await NotificationService.markAsRead(notificationId, idUser)
      if (!updated) throw new HttpException(403, 'No autorizado')

      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  }
}
