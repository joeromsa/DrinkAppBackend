/**
 * Controller for routes related to drinks.
 * Error handling automatically passed to error middleware by express-async-errors
 */


const drinksRouter = require('express').Router()
const Drink = require('../models/drink')
const multer = require('multer')
const User = require('../models/user')
const fs = require('fs').promises
const jwt = require('jsonwebtoken')

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

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


// GET all drinks from DB. 
drinksRouter.get('/', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const drinks = await Drink.find({'user': user._id}).populate('user', {username: 1, name: 1})
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
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const drink = new Drink({
        name: body.name,
        date: new Date(),
        glassware: body.glassware,
        ingredients: JSON.parse(body.ingredients), //body.ingredients
        description: body.description,
        drinkImage: req.file.path,
        user: user._id
    })

    const savedDrink = await drink.save()
    user.drinks = user.drinks.concat(savedDrink._id)
    await user.save()

    res.json(savedDrink)
})

module.exports = drinksRouter