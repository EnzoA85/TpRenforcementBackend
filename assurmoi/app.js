const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors')
const { body, validationResult } = require('express-validator')
const { validateUsername } = require('./middlewares/users')

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://example.com', '*']
}))

app.use('/user/', validateUsername, (req, res) => {
    const user = req.body;
    res.status(201).json({
        user
    })
})

app.use('/user/:id', (req, res) => {
    res.status(200).json({
        user: req.params.id
    })
})

app.use('/', (req, res, next) => {
    console.log('middle ware 1 homepage')
    next()
}, (req, res, next) => {
    console.log('Controller homepage')
    res.status(200).json({
        message: "Bienvenu sur la route d'accueil"
    })
});

app.listen(PORT, () => {
    console.log('server running on port ', PORT)
})

module.exports = app;