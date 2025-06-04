import { Request, Response, NextFunction } from 'express'
import { ClubService } from '../services/club.service'
import { HttpException } from '../exceptions/httpException'
import { NotificationService } from '../services/notification.service'
import { prisma } from '../database/database'
import { notifyClubAdmins, notifyClubMembers } from '../utils/notify.util'

export class ClubController {
    static addBook(arg0: string, isAuthenticate: (req: Request, res: Response, next: NextFunction) => void, addBook: any) {
        throw new Error('Method not implemented.')
    }
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(401, 'No autorizado')

            const club = await ClubService.create(name, description, userId)
            res.status(201).json(club)
        } catch (error) {
            next(error)
        }
    }


    static async getAllClubs(req: Request, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string | undefined;
            const clubs = await ClubService.getAllClubs(search);
            res.status(200).json(clubs);
        } catch (error) {
            next(error);
        }
    }



    static async getAllForUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new HttpException(401, 'No autorizado')

            const clubs = await ClubService.getUserClubs(userId)
            res.status(200).json(clubs)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            if (isNaN(id)) throw new HttpException(400, 'ID inválido')
            const club = await ClubService.getById(id)
            res.status(200).json(club)
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const userId = req.user?.id
            if (!userId || isNaN(id)) throw new HttpException(400, 'Datos inválidos')
            const club = await ClubService.update(id, userId, req.body)
            res.status(200).json(club)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            if (isNaN(id)) throw new HttpException(400, 'ID inválido')

            const userId = req.user?.id
            if (!userId) throw new HttpException(401, 'No autorizado')

            console.log('Deleting club, id=', id, 'user=', userId)

            // Guarda el nombre antes de eliminar
            const club = await prisma.club.findUnique({ where: { id } })

            const deletedClub = await ClubService.delete(id, userId)

            if (club) {
                await notifyClubMembers(id, `El club "${club.name}" ha sido eliminado`)
            }

            res.status(200).json(deletedClub)
        } catch (error) {
            next(error)
        }
    }



    static async join(req: Request, res: Response, next: NextFunction) {
        try {
            const clubId = Number(req.params.id)
            const userId = req.user?.id
            if (isNaN(clubId) || !userId) throw new HttpException(400, 'Datos inválidos')

            const membership = await ClubService.join(clubId, userId)

            const user = await prisma.user.findUnique({ where: { id: userId } })
            const club = await prisma.club.findUnique({ where: { id: clubId } })
            if (club) {
                await notifyClubAdmins(clubId, `"${user?.name}" se ha unido al club "${club.name}"`)
            }

            res.status(201).json(membership)
        } catch (error) {
            next(error)
        }
    }

    static async leave(req: Request, res: Response, next: NextFunction) {
        try {
            const clubId = Number(req.params.id)
            const userId = req.user?.id
            if (isNaN(clubId) || !userId) throw new HttpException(400, 'Datos inválidos')

            await ClubService.leave(clubId, userId)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    static async delegateAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const clubId = Number(req.params.id)
            const newAdminId = Number(req.params.memberId)
            const currentUserId = req.user?.id

            if (!currentUserId || isNaN(clubId) || isNaN(newAdminId)) {
                throw new HttpException(400, 'Parámetros inválidos o no autorizado')
            }

            const updatedClub = await ClubService.delegateAdmin(
                clubId,
                currentUserId,
                newAdminId,
            )

            // Obtenemos el nombre del club para la notificación
            const club = await prisma.club.findUnique({ where: { id: clubId } })
            if (club) {
                await NotificationService.create(
                    newAdminId,
                    `Has sido nombrado administrador del club "${club.name}"`
                )
            }

            res.status(200).json(updatedClub)
        } catch (error) {
            next(error)
        }
    }


}

