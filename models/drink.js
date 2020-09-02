/**
 * Model for MongoDB drink object
 */

const mongoose = require('mongoose')

// set for deprication warning
mongoose.set('useFindAndModify', false)

//Schema detailing drink object. Gives type and makes them required.
const drinkSchema = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    glassware: {type: String, required: true},
    ingredients: {type: [{quantity: String, ingredient: String}], required: true},
    //measurements: {type: [String], required: true},
    description: {type: String, required: true},
})

// converts data from DB into JSON. Makes converts id to String, and removes _id and __v. 
drinkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        returnedObject.ingredients.forEach(e => delete e._id)
    }
})

module.exports = mongoose.model('Drink', drinkSchema)