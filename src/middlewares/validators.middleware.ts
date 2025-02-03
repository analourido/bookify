import { body } from 'express-validator'

export const registerValidation = [
    body('email').isEmail().withMessage('Invalid email'),   //validara si es un email
    body('password').isLength({ min: 4 }).withMessage('Password too short'),   // valida que el password tena un tamaño (min: 4 caracteres)
    body('name').notEmpty().withMessage('Name required')
]

export const loginValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password required'),
]