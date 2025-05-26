import { prisma } from "../database/database"
import { HttpException } from "../exceptions/httpException"

export class ClubMessageService {
  static async create(clubId: number, userId: number, message: string) {
    const isMember = await prisma.clubMember.findFirst({
      where: {
        idClub: clubId,
        idUser: userId,
      }
    })

    if (!isMember) throw new HttpException(403, 'Solo los miembros pueden enviar mensajes')

    return prisma.clubMessage.create({
      data: {
        idClub: clubId,
        idUser: userId,
        message
      }
    })
  }

  static async getAll(clubId: number) {
    return prisma.clubMessage.findMany({
      where: { idClub: clubId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, surname: true } }
      }
    })
  }
}
