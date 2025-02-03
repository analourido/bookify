import { Response, Request, NextFunction } from 'express'

export class OfferController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const offer = await OffertService.getById(id)
            res.status(200).json(offer)
        } catch (error) {
            next(error)
        }
    }
}