import { Request, Response, NextFunction } from 'express'
import { ClubVoteService } from '../services/clubVote.service'
import { HttpException } from '../exceptions/httpException'

export class ClubVoteController {
  static async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const clubId = Number(req.params.id)
      const { idBook } = req.body

      if (!userId || isNaN(clubId) || !idBook) {
        throw new HttpException(400, 'Parámetros inválidos')
      }

      const vote = await ClubVoteService.vote(clubId, idBook, userId)
      res.status(201).json(vote)
    } catch (err) {
      next(err)
    }
  }

  static async getVotes(req: Request, res: Response, next: NextFunction) {
    try {
      const clubId = Number(req.params.id)
      if (isNaN(clubId)) throw new HttpException(400, 'ID de club inválido')

      const votes = await ClubVoteService.getVotes(clubId)
      res.status(200).json(votes)
    } catch (err) {
      next(err)
    }
  }

  static async getMostVoted(req: Request, res: Response, next: NextFunction) {
    try {
      const clubId = Number(req.params.id)
      if (isNaN(clubId)) throw new HttpException(400, 'ID de club inválido')

      const book = await ClubVoteService.getMostVotedBook(clubId)
      res.status(200).json(book || { message: 'Aún no hay votos' })
    } catch (err) {
      next(err)
    }
  }
}
