import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Category } from "@prisma/client";

//TODO problema, mejor usar el patrón singleton

export class CategoryService {
    static async getAll() {
        return prisma.category.findMany();
    }

    static async getById(id: number) {
        const findBook = await prisma.category.findUnique({ where: { id: id } });
        if (!findBook) throw new HttpException(404, "Category doesn't exist");

        return findBook;
    }

    static async create(category: Category) {
        try {
            return await prisma.category.create({
                data: {
                    ...category,
                },
            });
        } catch (error) {
            throw new HttpException(401, "Error creating category");
        }
    }

    static async update(id: number, category: Category) {
        try {
            return await prisma.category.update({
                where: { id },
                data: { ...category },
            });
        } catch (error) {
            throw new HttpException(404, "Category not found");
        }
    }

    static async delete(id: number) {
        try {
            return await prisma.category.delete({ where: { id } });
        } catch (error) {
            throw new HttpException(404, "Category not found");
        }
    }
}