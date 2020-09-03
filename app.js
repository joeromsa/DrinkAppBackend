/**
 * Creates actual application by taking router and middleware into use.
 */

const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/drinksCont')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const drinksRouter = require('./controllers/drinksCont')

logger.info('connecting to', config.MONGODB_URI)

// Connect to the DB.
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

// Calling middleware.
app.use(cors())
app.use(express.static('build'))
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/drinks', drinksRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app