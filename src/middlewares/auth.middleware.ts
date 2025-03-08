import { CustomJwtPayload } from '../utils/CustomJwtPayload'
import { Response, Request, NextFunction } from 'express'
import jwt from "jsonwebtoken"

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'
//TODO quita el any
export const isAuthenticate = (req: Request, res: Response, next: NextFunction): any => {

    //const token = req.headers.authorization?.split(" ")[1]
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Access denied' })

    try {
        const tokenDecodificado = jwt.verify(token, TOKEN_PASSWORD)
        req.user = tokenDecodificado as CustomJwtPayload
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' })
    }
}