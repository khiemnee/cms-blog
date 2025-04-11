import express from 'express'
import('../database/db.js')
import userRouter from './router/user.js'
import postRouter from './router/post.js'
import categoryRouter from './router/category.js'
import commentRouter from './router/comment.js'
import('./redis/redis.js')

const port = process.env.port
const app = new express()
app.use(express.json());
app.use(userRouter)
app.use(postRouter)
app.use(categoryRouter)
app.use(commentRouter)

app.listen(port,()=>{
    console.log('server is up')
})