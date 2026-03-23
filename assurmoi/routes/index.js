const userRoutes = require('./users');

function initRoutes(app) {
    // déclaration des routes par métiers.
    app.use('/user', userRoutes)

    app.use('/', (req, res, next) => {
        //middleware
        console.log('middle ware 1 homepage')
        next()
    }, (req, res, next) => {
        //controller
        console.log('Controller homepage')
        res.status(200).json({
            message: "Bienvenu sur la route d'accueil"
        })
    });
}

module.exports = initRoutes