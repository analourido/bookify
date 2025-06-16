import express, { Response, Request } from 'express'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'
import bookRouter from './routes/book.routes'
import categoryRouter from './routes/category.routes'
import suggestionRouter from './routes/suggestion.routes'

import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import clubRoutes from './routes/club.routes'
import reviewRoutes from './routes/review.routes'
import notificationRoutes from './routes/notification.routes'
import externalBookRoutes from './routes/externalBook.routes'
import statisticsRoutes from './routes/statistics.routes'
import readingHistoryRoutes from './routes/readingHistory.routes'
import readingListRouter from './routes/readingList.routes'

const app = express()


app.use(cookieParser())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://bookify-fronted.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))
const limiter = rateLimit({
    max: 1000,
    windowMs: 1000 * 15 * 60 // 15 minutos
})
app.use(limiter)

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/books', bookRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/suggestions', suggestionRouter)
app.use('/api/clubs', clubRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/external-books', externalBookRoutes)
app.use('/api/statistics', statisticsRoutes)
app.use('/api/reading-history', readingHistoryRoutes);
app.use('/api/my-reading-lists', readingListRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenido al backend de bookify (api rest)')
})

export default app