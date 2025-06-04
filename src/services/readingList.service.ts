import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'

export class ReadingListService {
    static async getUserLists(userId: number) {
        return prisma.readingList.findMany({
            where: { idUser: userId },
            include: { books: { include: { book: true } } },
        })
    }

    static async createList(userId: number, name: string) {
        const existing = await prisma.readingList.findFirst({
            where: { name, idUser: userId },
        })
        if (existing) throw new HttpException(400, 'Ya existe una lista con ese nombre.')
        return prisma.readingList.create({
            data: { name, idUser: userId },
        })
    }

    static async addBookToList(listId: number, bookId: number, userId: number) {
        const list = await prisma.readingList.findUnique({
            where: { id: listId },
        })
        if (!list) throw new HttpException(404, 'Lista no encontrada.')
        if (list.idUser !== userId) throw new HttpException(403, 'No autorizado.')

        const exists = await prisma.readingListBook.findFirst({
            where: { idReadingList: listId, idBook: bookId },
        })
        if (exists) throw new HttpException(400, 'Este libro ya está en la lista.')

        return prisma.readingListBook.create({
            data: { idReadingList: listId, idBook: bookId },
        })
    }

    static async deleteList(listId: number, userId: number) {
        const list = await prisma.readingList.findUnique({
            where: { id: listId },
        })
        if (!list) throw new HttpException(404, 'Lista no encontrada.')
        if (list.idUser !== userId) throw new HttpException(403, 'No autorizado.')

        await prisma.readingListBook.deleteMany({
            where: { idReadingList: listId },
        })
        return prisma.readingList.delete({
            where: { id: listId },
        })
    }
}
