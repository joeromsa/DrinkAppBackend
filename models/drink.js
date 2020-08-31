const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    }) 

const drinkSchema = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    glassware: {type: String, required: true},
    ingredients: {type: [String], required: true},
    measurements: {type: [String], required: true},
    description: {type: String, required: true},
})

drinkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Drink', drinkSchema)