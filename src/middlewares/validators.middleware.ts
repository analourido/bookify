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

export const suggestionValidation = [
    body('title')
        .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres'),
    body('description')
        .optional()
        .isLength({ max: 2000 }).withMessage('La descripción no puede superar los 2000 caracteres'),
];

export const clubValidation = [
    body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre del club debe tener entre 2 y 100 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('La descripción no puede superar los 1000 caracteres'),
  ]

  export const clubUpdateValidation = [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('La descripción no puede superar los 1000 caracteres'),
  ]

  export const clubBookValidation = [
    body('bookId')
      .isInt({ gt: 0 })
      .withMessage('El campo bookId es obligatorio y debe ser un entero positivo'),
  ]

  export const reviewValidation = [
    body('content')
      .isLength({ min: 5, max: 1000 }).withMessage('La reseña debe tener entre 5 y 1000 caracteres'),
    body('rating')
      .isInt({ min: 1, max: 5 }).withMessage('La puntuación debe estar entre 1 y 5')
  ]
  
  export const bookImportValidation = [
    body('title').isLength({ min: 2 }).withMessage('Título requerido'),
    body('author').isLength({ min: 2 }).withMessage('Autor requerido'),
    body('genre').notEmpty().withMessage('Género requerido'),
    body('publishedAt').isInt({ min: 1000, max: 2100 }).withMessage('Año inválido'),
    body('coverUrl').optional().isURL().withMessage('URL inválida')
  ]
