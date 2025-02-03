import { UserService } from "../services/user.service";
import { Response, Request, NextFunction } from 'express'

export class UserController {
    static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body.user
            const user = await UserService.getByEmail(email)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getAll()
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}