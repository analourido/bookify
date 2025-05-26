import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CustomJwtPayload } from '../utils/CustomJwtPayload'
import { HttpException } from '../exceptions/httpException'

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export const isAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next(new HttpException(401, 'Access denied'))
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return next(new HttpException(401, 'Invalid token format'))
  }

  try {
    const decoded = jwt.verify(token, TOKEN_PASSWORD)
    req.user = decoded as CustomJwtPayload
    next()
  } catch (err) {
    return next(new HttpException(401, 'Invalid or expired token'))
  }
}
