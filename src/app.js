import express from 'express'
import('../database/db.js')
import('./redis/redis.js')
import userRouter from './router/user.js'
import postRouter from './router/post.js'
import categoryRouter from './router/category.js'
import commentRouter from './router/comment.js'
import cors from 'cors';


const app = new express()
app.use(express.json());
app.use(cors());
app.use(userRouter)
app.use(postRouter)
app.use(categoryRouter)
app.use(commentRouter)

export default app