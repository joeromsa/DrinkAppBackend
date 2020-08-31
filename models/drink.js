const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

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