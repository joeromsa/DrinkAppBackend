/**
 * Controller for routes related to drinks.
 */


const drinksRouter = require('express').Router()
const Drink = require('../models/drink')

// GET all drinks from DB. 
drinksRouter.get('/', (req, res) => {
    Drink.find({}).then(drinks => {
        res.json(drinks)
    })
})

// GET single drink from DB based on its id.
drinksRouter.get('/:id', (req, res, next) => {
    Drink.findById(req.params.id)
    .then(drink => {
        if(drink) {
            res.json(drink)
        }
        else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

// DELETE drink from DB based on its id.
drinksRouter.delete('/:id', (req, res) => {
    Drink.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


// POST adds new drink object to DB. Creates new drink object from request and saves it.
drinksRouter.post('/', (req, res, next) => {
    const body = req.body

    const drink = new Drink({
        name: body.name,
        date: new Date(),
        glassware: body.glassware,
        ingredients: body.ingredients,
        measurements: body.measurements,
        description: body.description,
    })

    drink.save()
        .then(savedDrink => savedDrink.toJSON())
        .then(savedAndFormattedDrink => {
            res.json(savedAndFormattedDrink)
        })
        .catch(error => next(error))
})

module.exports = drinksRouter