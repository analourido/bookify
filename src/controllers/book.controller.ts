import { Response, Request, NextFunction } from 'express'
import { BookService } from "../services/book.services"
import { HttpException } from '../exceptions/httpException';

export class BookController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid book ID");

            // pasar a entero
            const book = await BookService.getById(id)
            res.status(200).json(book)
        } catch (error) {
            next(error)
        }
    }
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.query;
            const user = await BookService.getAll(title as string)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bookData = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User creator ID is required");

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

}
