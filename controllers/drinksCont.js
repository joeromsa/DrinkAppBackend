/**
 * Controller for routes related to drinks.
 * Error handling automatically passed to error middleware by express-async-errors
 */


const drinksRouter = require('express').Router()
const Drink = require('../models/drink')

// GET all drinks from DB. 
drinksRouter.get('/', async (req, res) => {
    const drinks = await Drink.find({})
        res.json(drinks)
})

// GET single drink from DB based on its id.
drinksRouter.get('/:id', async (req, res) => {
    const drink = await Drink.findById(req.params.id)
    if(drink) {
        res.json(drink)
    }
    else {
        res.status(404).end()
    }
})

// DELETE drink from DB based on its id.
drinksRouter.delete('/:id', async (req, res) => {
    await Drink.findByIdAndRemove(req.params.id)
    res.status(204).end()
})


// POST adds new drink object to DB. Creates new drink object from request and saves it.
drinksRouter.post('/', async (req, res) => {
    const body = req.body

    const drink = new Drink({
        name: body.name,
        date: new Date(),
        glassware: body.glassware,
        ingredients: body.ingredients,
        measurements: body.measurements,
        description: body.description,
    })

    const savedDrink = await drink.save()
    res.json(savedDrink)
})

module.exports = drinksRouter