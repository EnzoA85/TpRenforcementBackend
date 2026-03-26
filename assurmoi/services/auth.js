const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async(req, res) => {
    try {
        const { usesrname, password } = req.body

        const user = await User.findOne({
            where: {
                username
            }
        })

        if(!user) return res.status(404).json({
            message: 'User not found'
        })

        const isPasswordValide = await bcrypt.compare(password, user.password);
        if(!isPasswordValide) return res.status(401).json({
            message: 'Incorrect password'
        })

        const token = jwt.sign({ user: user.clean() }, process.env.SECRET_KEY, { expiresIn: '1h'})

        user.token = token
        user.save()

        return res.status(200).json({
            token
        })
    } catch(err) {
        return res.status(400).json({
            message: "Error on login"
        })
    }
}

const logout = (req, res) => {
    const
}

module.exports = {
    login
}