import { Club } from '@prisma/client'
import { prisma } from '../database/database'
import { HttpException } from '../exceptions/httpException'

export class ClubService {

    static async create(name: string, description: string, userId: number) {
        return prisma.club.create({
            data: {
                name,
                description,
                idUser: userId,      // Creador, solo para referencia
                members: {
                    create: {
                        idUser: userId,   // Se une al club
                        role: 'admin',    // Admin solo de este club
                    },
                },
            },
        })
    }


    static async getUserClubs(userId: number) {
        const memberships = await prisma.clubMember.findMany({
            where: { idUser: userId },
            include: {
                club: {
                    include: {
                        admin: { select: { id: true, name: true } },
                    },
                },
            },
        })

        return memberships.map((m) => m.club)
    }

    static async getById(clubId: number) {
        const club = await prisma.club.findUnique({
            where: { id: clubId },
            include: {
                books: {
                    include: {
                        book: {
                            select: { id: true, title: true, author: true, genre: true, coverUrl: true }
                        }
                    }
                },
                members: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                ClubVote: true,
                admin: { select: { id: true, name: true } }
            }
        })

        if (!club) throw new HttpException(404, "Club no encontrado")

        return club
    }

    static async getAllClubs(search?: string) {
        return await prisma.club.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search } },
                        { admin: { name: { contains: search } } }
                    ]
                }
                : {},
            include: { admin: true }
        });
    }



    static async update(id: number, userId: number, data: { name?: string; description?: string }) {
        const club = await prisma.club.findUnique({ where: { id } })
        if (!club) throw new HttpException(404, 'Club not found')
        if (club.idUser !== userId) throw new HttpException(403, 'No autorizado')

        return await prisma.club.update({ where: { id }, data })
    }

    static async delete(id: number, userId: number) {
        // 1) Comprueba existencia y permisos
        const club = await prisma.club.findUnique({ where: { id } })
        if (!club) throw new HttpException(404, 'Club not found')
        if (club.idUser !== userId) throw new HttpException(403, 'No autorizado')

        // 2) Borra relaciones dependientes (opcional si tienes cascadas en BD)
        await prisma.$executeRawUnsafe(
            `DELETE FROM ClubMember WHERE idClub = ${id}`
        )
        await prisma.$executeRawUnsafe(
            `DELETE FROM ClubBook WHERE idClub = ${id}`
        )

        // 3) Borra el propio club con raw SQL
        await prisma.$executeRawUnsafe(
            `DELETE FROM Club WHERE id = ${id}`
        )

        // 4) Devuelve el objeto original (o un { id } si prefieres)
        return club
    }


    /* Une al usuario a un club (como miembro) */
    static async join(clubId: number, userId: number) {
        // 1. Verifica que el club existe
        const club = await prisma.club.findUnique({ where: { id: clubId } })
        if (!club) throw new HttpException(404, 'Club not found')

        // 2. Verifica que no esté ya en el club
        const existing = await prisma.clubMember.findUnique({
            where: {
                idClub_idUser: { idClub: clubId, idUser: userId },
            },
        })
        if (existing) throw new HttpException(400, 'Ya eres miembro de este club')

        // 3. Crea la relación
        return await prisma.clubMember.create({
            data: {
                idClub: clubId,
                idUser: userId,
                role: 'member',
            },
        })
    }

    /** Quita al usuario del club */
    static async leave(clubId: number, userId: number) {
        // 1. Verifica que la relación exista
        const membership = await prisma.clubMember.findUnique({
            where: {
                idClub_idUser: { idClub: clubId, idUser: userId },
            },
        })
        if (!membership) throw new HttpException(400, 'No eres miembro de este club')

        // 2. Impide que el admin salga sin delegar (opcional)
        if (membership.role === 'admin') {
            throw new HttpException(403, 'El admin no puede abandonar el club sin delegar el rol')
        }

        // 3. Elimina la relación
        return await prisma.clubMember.delete({
            where: {
                id: membership.id,
            },
        })
    }

    /**
   * Delegar el rol de admin de un club a otro miembro.
   * @param clubId ID del club 
   * @param currentUserId ID del usuario que solicita la delegación (debe ser admin)
   * @param newAdminUserId ID del miembro que recibirá el rol de admin
   */


    static async delegateAdmin(
        clubId: number,
        currentUserId: number,
        newAdminUserId: number
    ) {
        // 1. Verificar existencia del club
        const club = await prisma.club.findUnique({ where: { id: clubId } })
        if (!club) throw new HttpException(404, 'Club not found')

        // 2. Verificar que el solicitante es admin
        const currentMembership = await prisma.clubMember.findUnique({
            where: { idClub_idUser: { idClub: clubId, idUser: currentUserId } },
        })
        if (!currentMembership || currentMembership.role !== 'admin') {
            throw new HttpException(403, 'No autorizado')
        }

        // 3. Verificar que el nuevo admin es miembro
        const newMembership = await prisma.clubMember.findUnique({
            where: { idClub_idUser: { idClub: clubId, idUser: newAdminUserId } },
        })
        if (!newMembership) {
            throw new HttpException(404, 'Member not found')
        }

        // 4. Ejecutar en transacción:
        //    - Actualizar club.idUser a newAdminUserId (campo admin)
        //    - Demote currentMembership to 'member'
        //    - Promote newMembership to 'admin'
        await prisma.$transaction([
            prisma.club.update({
                where: { id: clubId },
                data: { idUser: newAdminUserId },
            }),
            prisma.clubMember.update({
                where: { id: currentMembership.id },
                data: { role: 'member' },
            }),
            prisma.clubMember.update({
                where: { id: newMembership.id },
                data: { role: 'admin' },
            }),
        ])

        // 5. Devolver el club actualizado con su nuevo admin
        return prisma.club.findUnique({
            where: { id: clubId },
            include: {
                admin: { select: { id: true, name: true } },
                members: { include: { user: { select: { id: true, name: true } } } }
            },
        })
    }

    static async removeVote(clubId: number, userId: number) {
        // Verificamos que exista un voto previo
        const existingVote = await prisma.clubVote.findFirst({
            where: {
                idClub: clubId,
                idUser: userId,
            },
        });

        if (!existingVote) {
            throw new HttpException(404, 'No hay voto previo para eliminar');
        }

        // Elimina el voto
        return await prisma.clubVote.delete({
            where: { id: existingVote.id },
        });
    }


}

