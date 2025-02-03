import { Response, Request, NextFunction } from 'express'

export class BookController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const book = await BookService.getById(id)
            res.status(200).json(book)
        } catch (error) {
            next(error)
        }
    }
}