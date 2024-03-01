const express = require('express')
const cors = require('cors')

require('./db/mongoose')

const fileRouter = require('./routers/file')

const app = express()

// middleware for automatically parsing json
app.use(express.json())
app.use(cors())

app.use(fileRouter)

module.exports = app
