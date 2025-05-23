import { Suggestion } from "@prisma/client";
import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";

export class SuggestionService {

    static async getAll(searchQuery: string = '') {

        return await prisma.suggestion.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchQuery,
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100,
            include: {
            }
        });
    }

    static async getById(id: number) {
        const findSuggest = await prisma.suggestion.findUnique({ where: { id: id } })
        if (!findSuggest) throw new HttpException(404, "Suggestion doesn't exist");

        return findSuggest
    }

    static async create(idUser: number, suggestion: Suggestion) {
        console.log('creando', idUser)
        return await prisma.suggestion.create({
            data: {
                ...suggestion,
                idUser: idUser

            }
        })
    }

    static async update(id: number, suggestion: Suggestion) {
        const findSuggest = await prisma.suggestion.findUnique({ where: { id } })
        if (!findSuggest) throw new HttpException(404, "Suggestion doesn't exist")
        return await prisma.suggestion.update({
            where: { id },
            data: {
                ...suggestion,
            }
        })
    }

    static async delete(id: number) {
        try {
            return await prisma.suggestion.delete({ where: { id } });
        } catch (error) {
            throw new HttpException(404, "Suggestion not found");
        }
    }

}