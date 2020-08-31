/**
 * Handles printing info to console.
 * @param  {...any} params 
 */

 // Takes the parameters given to it and prints it to the console.
const info = (...params) => {
    console.log(...params)
}

// Takes the parameters given to it and prints it to the console as an error. 
const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}