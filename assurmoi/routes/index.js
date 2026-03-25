const userRoutes = require('./users');
const sinistreRoutes = require('./sinistres');
const documentRoutes = require('./documents');

function initRoutes(app) {
    // déclaration des routes par métiers.
    app.use('/user', userRoutes)
    app.use('/sinistre', sinistreRoutes)
    app.use('/document', documentRoutes)

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