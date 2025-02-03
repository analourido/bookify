// auth middleware revisa si el usuario esta autenticado 

import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'
//TODO quita el any
export const isAuthenticate = (req: Request, res: Response, next: NextFunction): any => {

    // devuleve el token 
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Access denied' })
    //  comprobar si el token es valido con jwt y asi decodificarlo
    try {
        const tokenDecoded = jwt.verify(token, TOKEN_PASSWORD) //   para verificar se necesita el token y su password 
        req.body.user = tokenDecoded
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' })
    }



}

export const isAdmin = (req: Request, res: Response, next: NextFunction): any => {

    if (!isAuthenticate) return res.status(401).json({ error: 'Access denied' })



}