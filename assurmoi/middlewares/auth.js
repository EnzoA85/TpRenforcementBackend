const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config()

const validateAuthentication = (req, res, next) => {
    const authorizationHeader = req.headers('authorization');
    
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

        if(Date.now() >= (decode.exp * 1000)) {
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

module.exports = {
    validateAuthentication,
    isSuperAdmin
}