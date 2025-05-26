import { Request, Response, NextFunction } from 'express'
import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'

export const isClubAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id
  const clubId = Number(req.params.id)

  if (!userId || isNaN(clubId)) {
    return next(new HttpException(400, 'Parámetros inválidos'))
  }

  const member = await prisma.clubMember.findFirst({
    where: {
      idClub: clubId,
      idUser: userId,
      role: 'admin'
    }
  })

  if (!member) {
    return next(new HttpException(403, 'Solo el admin del club puede realizar esta acción'))
  }

  next()
}
