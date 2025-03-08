import { body } from 'express-validator'

export const registerValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 4 }).withMessage('Password too short'),
    body('name').notEmpty().withMessage('Name required')
]

export const loginValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password required')
]

export const bookValidation = [
    body('title')
        .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres'),
    body('author')
        .isLength({ min: 2, max: 50 }).withMessage('El autor debe tener entre 2 y 50 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 2000 }).withMessage('La descripción no puede superar los 2000 caracteres'),
    body('publishedAt')
        .optional()
        .isISO8601().toDate().withMessage('Formato de fecha incorrecto'),
];

export const categoryValidation = [
    body('name').notEmpty().withMessage('Name required')
]

