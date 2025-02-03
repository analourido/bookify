import { HttpException } from "@/exceptions/httpException";
import { PrismaClient, User } from "@prisma/client";  //prisma ya nos crea una interfaz de User

const prisma = new PrismaClient()

export class UserService {

    //saber que usuario se logeo por el email
    static async getByEmail(email: string) {
        const findUser = await prisma.user.findUnique(
            { where: { email }, omit: { password: true } }                  //nos devuelve el usuario que estoy buscando
        )
        if (!findUser) throw new HttpException(404, 'User not found')
        return findUser
    }

    //saber que usuario se logeo por el id
    static async getById(id: number) {
        const findUser = await prisma.user.findUnique({ where: { id } })    //nos devuelve el usuario que estoy buscando 
        if (!findUser) throw new HttpException(404, 'User not found')
        return findUser
    }

    static async getAll() {
        const users = await prisma.user.findMany({
            omit: { password: true }
        })
        return users
    }
}