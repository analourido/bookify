import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { HttpException } from "../exceptions/httpException";

export class CategoryController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryService.getAll();
            res.status(200).json(categories)
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new HttpException(400, "Invalid category ID");

            const category = await CategoryService.getById(id);
            res.status(200).json(category)
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.body;

            if (!category) throw new HttpException(400, "Category is required");

            const newCategory = await CategoryService.create(category);
            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new HttpException(400, "Invalid category ID");

            const category = req.body;
            if (!category) throw new HttpException(400, "Category is required");

            const updatedCategory = await CategoryService.update(id, category);
            res.status(200).json(updatedCategory)
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new HttpException(400, "Invalid category ID");

            const deleted = await CategoryService.delete(id);
            res.status(200).json(deleted)
        } catch (error) {
            next(error);
        }
    }
}