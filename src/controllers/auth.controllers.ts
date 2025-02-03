import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { Response, Request, NextFunction } from 'express'

export class AuthController {
    //el controlador nunca deberia acceder a la bd

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body
            const newUser = await AuthService.register(userData)
            res.status(201).json({ message: 'User register successfuly ', newUser })
        } catch (error) {
            next(error)
        }

    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body
            // TODO validar el body (OPCIONAL)
            // devolvemos el token 
            const token = await AuthService.login(userData.email, userData.password)  //solo le pedimos al usuario su email y password
            // TODO inyectar cookie al cliente
            res.cookie('token', token, {
                maxAge: 60 * 60 * 100,   // expira en 1h
                httpOnly: true,          //para que no se pueda acceder con JS (super importante)
                //secure: true,           // solo se envia si usas https
                sameSite: 'strict'       // solo va a ser valida la cookie si el backend y frontend vienen del mismo sitio (ataques CSRF)
            })
            res.status(201).json({ message: 'Login successfuly ', token })

        } catch (error) {
            next(error)
        }
    }

}