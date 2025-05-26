import { prisma } from "../database/database"
import { NotificationService } from "../services/notification.service"

export const notifyClubAdmins = async (clubId: number, message: string) => {
  const admins = await prisma.clubMember.findMany({
    where: { idClub: clubId, role: 'admin' }
  })

  await Promise.all(admins.map(admin =>
    NotificationService.create(admin.idUser, message)
  ))
}

export const notifyClubMembers = async (clubId: number, message: string) => {
  const members = await prisma.clubMember.findMany({
    where: { idClub: clubId },
    select: { idUser: true }
  })

  await Promise.all(members.map(member =>
    NotificationService.create(member.idUser, message)
  ))
}
