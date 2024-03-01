import express from 'express'
import cors from 'cors'
import fileRouter from './routers/file'

const app = express()

// middleware for automatically parsing json
app.use(express.json())
app.use(cors())

app.use(fileRouter)

export default app
