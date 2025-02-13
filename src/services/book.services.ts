import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Book, PrismaClient, User } from "@prisma/client";
//const prisma = new PrismaClient()

export class BookService {

    static async getById(id: number) {
        const findBook = await prisma.book.findUnique({ where: { id } })
        if (!findBook) throw new HttpException(404, 'Book not found')
        return findBook
    }

    static async getAll(title: string = '') {

        return await prisma.book.findMany({
            where: {
                ...(title && {
                    title: {
                        contains: title,
                    }
                })
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100,
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            }
        });
    }

    static async create(idUser: number, book: Book) {
        console.log('creando', idUser)
        return await prisma.book.create({
            data: {
                ...book,
                idUser: idUser
            }
        })
    }

    static async update(id: number, book: Book) {
        const findBook = await prisma.book.findUnique({ where: { id } })
        if (!findBook) throw new HttpException(404, 'Book doesnt exists')
        return await prisma.book.update({
            where: { id },
            data: {
                ...book,
            }
        })
    }

    static async delete(id: number) {
        try {
            return await prisma.book.delete({ where: { id } });
        } catch (error) {
            throw new HttpException(404, "Book not found");
        }
    }


}