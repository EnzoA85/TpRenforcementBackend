const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config()

const validateAuthentication = (req, res, next) => {
    const authorizationHeader = req.header('authorization');
    
    const token = authorizationHeader?.split(" ")[1]

    if (!token) return res.status(401).json({
        message: 'No token provided'
    });

    jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) =>{
        if(err) return res.status(401).json({
            message: 'Wrong JWT token'
        });

        // const user = decoded;
        const user = await User.findOne({
            where: { token }
        })

        if(!user) return res.status(403).json({
            message: 'Session expired'
        })

        if (!user.active) {
            user.token = null;
            user.save()
            return res.status(403).json({
                message: 'Account disabled'
            })
        }

        if(Date.now() >= (decoded.exp * 1000)) {
            user.token = null;
            user.save()
            return res.status(403).json({
                message: 'Token expired'
            })
        }

        req.user = user;
        next();
    })
}

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({
            message: 'Access forbidden'
        })
    }
    next();
}

// superadmin + manager (gestionnaire de portefeuille)
const isManagerOrAdmin = (req, res, next) => {
    if (!['superadmin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({
            message: 'Access forbidden: manager or admin required'
        })
    }
    next();
}

// superadmin + manager + request_manager (chargé de suivi)
const canManageRequests = (req, res, next) => {
    if (!['superadmin', 'manager', 'request_manager'].includes(req.user.role)) {
        return res.status(403).json({
            message: 'Access forbidden: request manager or above required'
        })
    }
    next();
}

// superadmin + manager + sinister_manager (chargé de clientèle)
const canManageSinistres = (req, res, next) => {
    if (!['superadmin', 'manager', 'sinister_manager'].includes(req.user.role)) {
        return res.status(403).json({
            message: 'Access forbidden: sinister manager or above required'
        })
    }
    next();
}

module.exports = {
    validateAuthentication,
    isSuperAdmin,
    isManagerOrAdmin,
    canManageRequests,
    canManageSinistres
}