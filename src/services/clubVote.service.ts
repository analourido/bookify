import { prisma } from "../database/database"
import { HttpException } from "../exceptions/httpException"

export class ClubVoteService {
  // Emitir voto o reemplazar si ya existe
  static async vote(clubId: number, bookId: number, userId: number) {
    // Verificamos que el usuario sea miembro del club
    const isMember = await prisma.clubMember.findFirst({
      where: { idClub: clubId, idUser: userId }
    })

    if (!isMember) throw new HttpException(403, 'Solo los miembros del club pueden votar')

    // Reemplazar voto si ya existe
    return prisma.clubVote.upsert({
      where: {
        idClub_idUser: {
          idClub: clubId,
          idUser: userId
        }
      },
      update: {
        idBook: bookId,
        createdAt: new Date()
      },
      create: {
        idClub: clubId,
        idBook: bookId,
        idUser: userId
      }
    })
  }

  // Obtener todos los votos de un club
  static async getVotes(clubId: number) {
    return prisma.clubVote.findMany({
      where: { idClub: clubId },
      include: {
        book: {
          select: { title: true }
        },
        user: {
          select: { name: true, surname: true }
        }
      }
    })
  }

  // Obtener el libro más votado en un club
  static async getMostVotedBook(clubId: number) {
    const result = await prisma.clubVote.groupBy({
      by: ['idBook'],
      where: { idClub: clubId },
      _count: { idBook: true },
      orderBy: { _count: { idBook: 'desc' } },
      take: 1
    })

    if (result.length === 0) return null

    const book = await prisma.book.findUnique({ where: { id: result[0].idBook } })
    return book
  }
}
