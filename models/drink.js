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
    description: {type: String, required: true},
    drinkImage: {type: String, required: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

// converts data from DB into JSON. Makes converts id to String, and removes _id and __v. 
drinkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        returnedObject.ingredients.forEach(i => delete i._id)
    }
})

module.exports = mongoose.model('Drink', drinkSchema)