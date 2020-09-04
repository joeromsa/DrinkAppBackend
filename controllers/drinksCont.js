/**
 * Controller for routes related to drinks.
 * Error handling automatically passed to error middleware by express-async-errors
 */


const drinksRouter = require('express').Router()
const Drink = require('../models/drink')
const multer = require('multer')
const fs = require('fs').promises

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || 'image/png') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
    
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


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
    const removed = await Drink.findByIdAndRemove(req.params.id)
    const path = `${removed.drinkImage}`
    try {
        await fs.unlink(path)
    }
    catch (error) {
        console.log(error)
    }
    res.status(204).end()
})


// POST adds new drink object to DB. Creates new drink object from request and saves it.
drinksRouter.post('/', upload.single('drinkImage'), async (req, res) => {
    const body = req.body

    const drink = new Drink({
        name: body.name,
        date: new Date(),
        glassware: body.glassware,
        ingredients: JSON.parse(body.ingredients),
        description: body.description,
        drinkImage: req.file.path
    })

    const savedDrink = await drink.save()
    res.json(savedDrink)
})

module.exports = drinksRouter