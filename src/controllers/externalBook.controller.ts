import { Request, Response, NextFunction } from 'express'
import { ExternalBookService } from '../services/externalBook.service'
import { HttpException } from '../exceptions/httpException'

export class ExternalBookController {
    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const title = req.query.title as string
            if (!title) throw new HttpException(400, 'Title is required')

            const books = await ExternalBookService.searchByTitle(title)
            res.status(200).json(books)
        } catch (error) {
            next(error)
        }
    }
}