const drinkSearchRouter = require('express').Router()
const axios = require('axios')


drinkSearchRouter.get('/:searchTerm', async (req, res) => {
    const drinks = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${req.params.searchTerm}`)
    res.send(drinks.data)
})

module.exports = drinkSearchRouter