import { prisma } from "../database/database"

export class NotificationService {
  static async create(idUser: number, message: string) {
    return prisma.notification.create({
      data: {
        idUser,
        message
      }
    })
  }

  static async getAll(idUser: number) {
    return prisma.notification.findMany({
      where: { idUser },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async markAsRead(notificationId: number, idUser: number) {
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } })
    if (!notif || notif.idUser !== idUser) return null

    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })
  }
}
