import { PrismaClient, User } from "@prisma/client";  //prisma ya nos crea una interfaz de User
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { HttpException } from '../exceptions/httpException'
import { prisma } from "../database/database";

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export class AuthService {
    // ahora el servicio tiene que acceder a la bd de prisma para registrar al usuario
    static async register(user: User) {
        //ver si el usuario no existe (usaremos el email para comprobarlo)
        const findUser = await prisma.user.findUnique({ where: { email: user.email } })
        //si el usuario ya existe devolvemos un error
        if (findUser) throw new HttpException(409, `User ${user.email} already exists`)

        // encriptar la password (se necesita una libreria externa (bcrypt))
        const passwordEncrypted = await bcrypt.hash(user.password, 10)  //10 -> nº veces que se genera el algoritmo
        user.password = ''

        //guardar en la bd el usuario

        return await prisma.user.create({
            data: {
                ...user,
                password: passwordEncrypted,
                role: null
            },
            omit: {
                password: true
            }
        })
    }

    static async login(email: string, password: string) {
        // ver si el usuario existe
        const findUser = await prisma.user.findUnique({ where: { email } })  // si se llama igual no hace falta que pongamos las dos 
        if (!findUser) throw new HttpException(401, `Invalid user or password`)//no damos mas informacion ya esta regustrado por privacidad y seguridad

        //ver si el password coincide
        const isPasswordCorrect = await bcrypt.compare(password, findUser.password) //devuelve un booleano
        if (!isPasswordCorrect) throw new HttpException(401, `Invalid user or password`)

        //genrar el token de autentificacion
        const token = jwt.sign(
            { id: findUser.id, email: findUser.email, role: findUser.role },
            TOKEN_PASSWORD,
            { expiresIn: "1h", })

        // devolver el token
        return token
    }

}