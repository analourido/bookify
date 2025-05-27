import { Response, Request, NextFunction } from 'express'
import { BookService } from "../services/book.services"
import { HttpException } from '../exceptions/httpException';
import { prisma } from '../database/database';

export class BookController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid book ID")

            const book = await prisma.book.findUnique({
                where: { id },
                include: {
                    category: true,
                    reviews: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            })

            if (!book) throw new HttpException(404, "Book not found")

            // Calcular nota media
            const ratings = book.reviews.map(r => r.rating)
            const averageRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                : null

            // Comprobar si el usuario puede reseñar el libro
            let canReview = false
            if (req.user) {
                const userId = req.user.id
                const clubs = await prisma.clubMember.findMany({
                    where: { idUser: userId },
                    select: { idClub: true }
                })
                const clubIds = clubs.map(c => c.idClub)

                const clubBook = await prisma.clubBook.findFirst({
                    where: {
                        idBook: id,
                        idClub: { in: clubIds }
                    }
                })
                canReview = !!clubBook
            }

            res.status(200).json({ ...book, averageRating, canReview })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('Query:', req.query) // 👈 AÑADE ESTO

            const { title } = req.query;
            const books = await BookService.getAll(title as string);
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    }


    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bookData = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User creator ID is required")

            const newBook = await BookService.create(userId, bookData)
            res.status(200).json(newBook)
        } catch (error) {
            next(error)
        }
    }


    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const bookData = req.body
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid book ID");

            const updatedBook = await BookService.update(id, bookData)
            res.status(200).json(updatedBook)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid book ID");

            const deletedBook = await BookService.delete(id)
            res.status(200).json(deletedBook)
        } catch (error) {
            next(error)
        }
    }

    static async importFromExternal(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new HttpException(401, 'No autorizado')

            const book = req.body

            console.log('Book recibido en backend:', book)

            const newBook = await prisma.book.create({
                data: {
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    description: book.description,
                    coverUrl: book.coverUrl,
                    publishedAt: new Date(book.publishedAt),
                    idUser: userId
                }
            })

            res.status(201).json(newBook)
        } catch (error) {
            next(error)
        }
    }


}
