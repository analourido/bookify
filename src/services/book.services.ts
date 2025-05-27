import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Book, PrismaClient, User } from "@prisma/client";
//const prisma = new PrismaClient()

export class BookService {

    static async getById(id: number) {
        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                category: {
                    select: { name: true }
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { id: true, name: true, surname: true } }
                    }
                }
            }
        })

        if (!book) throw new HttpException(404, 'Book not found')

        const avg = await prisma.review.aggregate({
            where: { idBook: id },
            _avg: { rating: true }
        })

        return {
            ...book,
            averageRating: avg._avg.rating ?? null
        }
    }


    static async getAll(searchQuery: string = '') {

        return await prisma.book.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchQuery,
                        },
                    },
                    {
                        author: {
                            contains: searchQuery,
                        },
                    },
                ],
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
        // Comprobar si ya existe un libro con mismo título + autor
        const existing = await prisma.book.findFirst({
            where: {
                title: book.title,
                author: book.author
            }
        })

        if (existing) {
            throw new HttpException(409, 'Este libro ya está en la base de datos')
        }

        return await prisma.book.create({
            data: {
                ...book,
                publishedAt: new Date(`${book.publishedAt}-01-01`),
                idUser
            }
        })
    }

    static async update(id: number, book: Book) {
        const findBook = await prisma.book.findUnique({ where: { id } })
        if (!findBook) throw new HttpException(404, 'Book doesnt exists')
        const cleanData = {
            title: book.title,
            author: book.author,
            genre: book.genre,
            description: book.description,
            coverUrl: book.coverUrl,
            publishedAt: book.publishedAt,
            idCategory: book.idCategory
        }

        return await prisma.book.update({
            where: { id },
            data: cleanData
        })
    }

    static async delete(id: number) {
        try {
            return await prisma.book.delete({ where: { id } });
        } catch (error) {
            throw new HttpException(404, "Book not found");
        }
    }

    static async getByCategoryId(categoryId: number): Promise<Book[]> {
        return await prisma.book.findMany({
            where: {
                idCategory: categoryId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100,
        });
    }


}