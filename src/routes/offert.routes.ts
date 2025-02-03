import { Router } from "express";
import { OfferController } from '../controllers/offert.controller'

const router = Router()

//API RESTFULL

/*
// todas las ofertas (solo registrados)-> GET htpp://localhost:3ooo/api/offerts/?title=react&category=dam
router.get('/', OfferController.getAll)
//oferta en particular por su id
router.get('/:id', OfferController.getById)
// añadir oferta nueva (solo admin pueden acceder) -> POST htpp://localhost:3ooo/api/offerts/ {body}
router.post('/', OfferController.create)
// borrar una oferta -> DELETE htpp://localhost:3ooo/api/offerts/XXXX
router.delete('/:id', OfferController.delete)
// modificar una oferta -> PUT htpp://localhost:3ooo/api/offerts/XXXX {body}
router.put('/:id', OfferController.update)

// Calificar una oferta x  {body}
router.post('/:id/rate/', OfferController.rate)
// Ver que calificacion (total) se le ha dado a una oferta
router.get('/:id/rate/', OfferController.getRate)*/

export default router