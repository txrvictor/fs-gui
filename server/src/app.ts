import express from 'express'
import cors from 'cors'
import rootRouter from './routers/root'
import nodeRouter from './routers/node'

const app = express()

// middleware for automatically parsing json
app.use(express.json())
app.use(cors())

app.use(rootRouter)
app.use(nodeRouter)

export default app
