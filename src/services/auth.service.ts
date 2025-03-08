import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { User } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// usar un patron: singlenton
//const prisma = new PrismaClient()
const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export class AuthService {
    static async register(user: User) {
        // ver si el usuario no existe
        // SELECT id,nombre FROM user WHERE email=user.email
        const findUser = await prisma.user.findUnique({ where: { email: user.email } })
        if (findUser) throw new HttpException(409, `User ${user.email} already exists`)

        // encriptar el password
        const passwordEncrypted = await bcrypt.hash(user.password, 10)
        user.password = ''
        // guardar el usuario en la bd
        // INSERT INTO user (name, password, email) VALUES (?,?,?)
        return await prisma.user.create({
            data: {
                ...user,
                password: passwordEncrypted,
                role: null,
                //a:'aa'
            },
            omit: {
                password: true
            }
        })
    }

    static async login(email: string, password: string) {
        // ver si el usuario existe
        //const query = `SELECT id, email, role, password FROM user WHERE email='${email}'`
        //const findUsers = await prisma.$queryRawUnsafe(query) as User[]
        //const findUser = findUsers[0]

        const findUser = await prisma.user.findUnique({ where: { email } })
        if (!findUser) throw new HttpException(401, 'Invalid user or password')
        // ver si el password coincide
        const isPasswordCorrect = await bcrypt.compare(password, findUser.password)
        if (!isPasswordCorrect) throw new HttpException(401, 'Invalid user or password')

        // generar el token de autenticación
        const token = jwt.sign(
            { id: findUser.id, email: findUser.email, role: findUser.role },
            TOKEN_PASSWORD,
            { expiresIn: "1h" }
        )
        // devolver el token y el usuario
        return { token, user: { id: findUser.id, email: findUser.email, role: findUser.role } }
    }

}