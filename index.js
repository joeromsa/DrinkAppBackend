require('dotenv').config()
const express = require('express')
const { response } = require('express')
const cors = require('cors')
const app = express()
const Drink = require('./models/drink')

app.use(cors())
app.use(express.json())

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path: ', req.path)
    console.log('Body: ', req.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/drinks', (req, res) => {
    Drink.find({}).then(drinks => {
        res.json(drinks)
    })
})

app.get('/api/drinks/:id', (req, res, next) => {
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

app.delete('/api/drinks/:id', (req, res) => {
    const id = Number(req.params.id)
    drinks = drinks.filter(drink => drink.id !== id)

    res.status(204).end()
})

app.post('/api/drinks', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    const drink = new Drink({
        name: body.name,
        date: new Date(),
        glassware: body.glassware,
        ingredients: body.ingredients,
        measurements: body.measurements,
        description: body.description,
    })

    drink.save().then(savedDrink => {
        res.json(savedDrink)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(400).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
