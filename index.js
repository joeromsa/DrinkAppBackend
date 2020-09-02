/**
 * Starting point for the application.
 * Imports and starts server.
 */

const app = require('./app') //actual express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Creates server
const server = http.createServer(app)

// Sets the port for the server to listen on. 
server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})
