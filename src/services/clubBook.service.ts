import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'

export class ClubBookService {

  static async addBook(clubId: number, userId: number, bookId: number) {
    // 1. Verificar que el club existe
    const club = await prisma.club.findUnique({ where: { id: clubId } })
    if (!club) throw new HttpException(404, 'Club not found')

    // 2. Verificar que el usuario es miembro del club
    const membership = await prisma.clubMember.findUnique({
      where: { idClub_idUser: { idClub: clubId, idUser: userId } },
    })
    if (!membership) throw new HttpException(403, 'No autorizado')

    // 3. Verificar que el libro existe
    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book) throw new HttpException(404, 'Book not found')

    // 4. Evitar duplicados
    const existing = await prisma.clubBook.findFirst({
      where: { idClub: clubId, idBook: bookId },
    })
    if (existing) throw new HttpException(400, 'Este libro ya fue propuesto')

    // 5. Crear la relación
    return prisma.clubBook.create({
      data: {
        idClub: clubId,
        idBook: bookId,
        selected: false,
      },
    })
  }

  static async listBooks(clubId: number, userId: number) {
    // 1. Verificar que el usuario es miembro
    const membership = await prisma.clubMember.findUnique({
      where: { idClub_idUser: { idClub: clubId, idUser: userId } },
    })
    if (!membership) throw new HttpException(403, 'No autorizado')

    // 2. Recuperar las propuestas
    return prisma.clubBook.findMany({
      where: { idClub: clubId },
      include: {
        book: {
          select: { id: true, title: true, author: true, genre: true, coverUrl: true },
        },
      },
      orderBy: { month: 'desc' },
    })
  }

  /**
   * Marca un libro como libro del mes en un club, deseleccionando los anteriores.
   */
  static async selectBook(clubId: number, userId: number, bookId: number) {
    // 1. Verificar admin del club
    const membership = await prisma.clubMember.findUnique({
      where: { idClub_idUser: { idClub: clubId, idUser: userId } },
    })
    if (!membership || membership.role !== 'admin') {
      throw new HttpException(403, 'No autorizado')
    }

    // 2. Verificar propuesta existe
    const existing = await prisma.clubBook.findFirst({
      where: { idClub: clubId, idBook: bookId },
    })
    if (!existing) {
      throw new HttpException(404, 'Propuesta no encontrada')
    }

    // 3. En transacción: desmarca todos y marca este
    await prisma.$transaction([
      prisma.clubBook.updateMany({
        where: { idClub: clubId },
        data: { selected: false },
      }),
      prisma.clubBook.update({
        where: { id: existing.id },
        data: {
          selected: true,
          month: new Date().toISOString().slice(0, 7), // "YYYY-MM"
        },
      }),
    ])

    // 4. Devuelve la entrada seleccionada
    return prisma.clubBook.findUnique({
      where: { id: existing.id },
      include: {
        book: { select: { id: true, title: true, author: true, genre: true, coverUrl: true } },
      },
    })
  }
  
}
