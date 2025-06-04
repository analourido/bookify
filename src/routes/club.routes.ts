// src/routes/club.routes.ts
import { Router } from 'express'
import { ClubController } from '../controllers/club.controller'
import { isAuthenticate } from '../middlewares/auth.middleware'
import { clubValidation, clubUpdateValidation, clubBookValidation } from '../middlewares/validators.middleware'
import { ValidationMiddleware } from '../middlewares/validation.middleware'
import { ClubBookController } from '../controllers/clubBook.controllers'
import { ClubVoteController } from '../controllers/clubVote.controller'
import { isClubAdmin } from '../middlewares/isClubAdmin.middleware'
import { ClubMessageController } from '../controllers/clubMessage.controller'

const router = Router()

router.post('/', isAuthenticate, clubValidation, ValidationMiddleware, ClubController.create)
router.get('/', isAuthenticate, ClubController.getAllForUser)
router.get('/all', isAuthenticate, ClubController.getAllClubs);
router.get('/:id', isAuthenticate, ClubController.getById)
router.patch('/:id', isAuthenticate, isClubAdmin, clubUpdateValidation, ValidationMiddleware, ClubController.update)
router.delete('/:id', isAuthenticate, isClubAdmin, ClubController.delete)
// rutas para unirse y salir de un club
router.post('/:id/join', isAuthenticate, ClubController.join)
router.post('/:id/leave', isAuthenticate, ClubController.leave)

// CLubBook routes
router.post('/:id/books', isAuthenticate, clubBookValidation, ValidationMiddleware, ClubBookController.addBook)
router.get('/:id/books', isAuthenticate, ClubBookController.listBooks)
router.patch('/:id/books/:bookId/select', isAuthenticate, isClubAdmin, ClubBookController.selectBook)
router.delete('/:id/books/:clubBookId', isAuthenticate, ClubBookController.deleteBook);

// Miembros del club
router.patch('/:id/members/:memberId/role', isAuthenticate, isClubAdmin, ClubController.delegateAdmin)

// VOTACIONES
router.post('/:id/vote', isAuthenticate, ClubVoteController.vote)
router.get('/:id/votes', isAuthenticate, ClubVoteController.getVotes)
router.get('/:id/most-voted', isAuthenticate, ClubVoteController.getMostVoted)

// mensajes del club
router.post('/:id/messages', isAuthenticate, ClubMessageController.create)
router.get('/:id/messages', isAuthenticate, ClubMessageController.getAll)

export default router
