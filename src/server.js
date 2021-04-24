'use strict'

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')
const { boomify } = require('@hapi/boom')
const morgan = require('morgan')

dotenv.config()

const { PORT = 3000, ENV } = process.env

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

ENV === 'dev' && app.use(morgan('dev'))

async function initDb () {
  await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
}

app.get('/', (req, res) => res.json({
  service: 'MyBags API',
  status: 'ok'
}))

Object.keys(routes).map((name) => app.use(`/${name}`, routes[name]))

app.use((error, req, res, next) => {
  if (!error) return next()

  ENV !== 'test' && console.error(error, `Error in : ${req.method}:${req.url}`)
  if (error instanceof mongoose.Error.ValidationError) {
    const { output } = boomify(error, {
      statusCode: 400
    })

    return res.status(output.statusCode).json(output.payload)
  }

  const { output } = boomify(error)
  return res.status(output.statusCode).json(output.payload)
})

initDb()
  .then(res => {
    console.log('DB Connected!')
    app.listen(PORT, () => {
      console.log(`Server start in port ${PORT}`)
    })
  })
  .catch(error => {
    console.error(`DB Conecction Error: ${error}`)
    process.exit(0)
  })
