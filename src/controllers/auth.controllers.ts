import { AuthService } from "../services/auth.service";
import {Response, Request, NextFunction} from 'express'

export class AuthController{
    static async register(req:Request, res:Response, next: NextFunction){
        try{
            const userData = req.body
            //TODO validar el body
            const newUser = await AuthService.register(userData)
            res.status(201).json({message:'User register successfully', newUser})
        }catch(error){
            next(error)
        }

    }

    static async login(req:Request, res:Response, next: NextFunction){
        try{
            const userData = req.body
            const token = await AuthService.login(userData.email, userData.password)
            //TODO inyectar cookie al cliente
            res.cookie('token', token, {
                maxAge: 60*60*1000*3, // 3 horas de caducidad
                httpOnly: true, // no se puede accerder mediante js
                secure: false, // solo se envia si usas https
                sameSite: 'strict', // Evita ataques CSRF

            })
            res.status(201).json({message:'Login successfully:', token})
        }catch(error){
            next(error)
        }
    }
}