const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const body = req.body

    const userCheck = await User.findOne({ username: body.username })

    console.log(userCheck)

    if (userCheck !== null) {
        return res.status(401).json({error: 'username already exists' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
        .populate('drinks', {name: 1, date: 1, glassware: 1, ingredients: 1, description: 1, drinkImage: 1})
    res.json(users)
})

module.exports = usersRouter