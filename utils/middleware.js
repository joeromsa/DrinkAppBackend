/**
 * Custom middleware
 */

const logger = require('./logger')
const { response } = require('express')

// Takes info from request, formats, and sends it to logger to be printed on console.
const requestLogger = (req, res, next) => {
    logger.info('Method: ', req.method)
    logger.info('Path: ', req.path)
    logger.info('Body: ', req.body)
    logger.info('---')
    next()
}

// If endpoint does not match any of the routes in the controller, response is given status code of 404.
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// If error is found, message is sent to logger to be printed, and then different error types are checked to
// send correct response. If not matched, error passed to express' error handler.
const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}