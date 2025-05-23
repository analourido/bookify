import { Response, Request, NextFunction } from "express";
import { HttpException } from "../exceptions/httpException";
import { SuggestionService } from "../services/suggestion.service";

export class SuggestionController {

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid book ID");

            // pasar a entero
            const suggestion = await SuggestionService.getById(id)
            res.status(200).json(suggestion)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.query;
            const user = await SuggestionService.getAll(title as string)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const suggestData = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User creator ID is required");

            const newSuggestion = await SuggestionService.create(userId, suggestData)
            res.status(200).json(newSuggestion)
        } catch (error) {
            next(error)
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const suggestData = req.body
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid suggestion ID");

            const updateSuggest = await SuggestionService.update(id, suggestData)
            res.status(200).json(updateSuggest)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid suggestion ID");

            const deleteSuggest = await SuggestionService.delete(id)
            res.status(200).json(deleteSuggest)
        } catch (error) {
            next(error)
        }
    }

}