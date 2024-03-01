const mongoose = require('mongoose')

const CONNECTION_URL = 'mongodb://mongo:27017/fsgui'

mongoose.connect(CONNECTION_URL).catch((err) => {
  console.error('Mongoose connection error: ', err)
})
