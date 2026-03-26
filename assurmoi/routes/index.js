const userRoutes = require('./users');
const sinistreRoutes = require('./sinistres');
const documentRoutes = require('./documents');
const requestRoutes = require('./requests');
const historyRoutes = require('./histories');
const authRoutes = require('./auth');

function initRoutes(app) {
    // déclaration des routes par métiers.
    app.use('/user', userRoutes)
    app.use('/sinistre', sinistreRoutes)
    app.use('/document', documentRoutes)
    app.use('/request', requestRoutes)
    app.use('/history', historyRoutes)
    app.use('/', authRoutes)
}

module.exports = initRoutes