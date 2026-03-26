const { User } = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require('dotenv').config()

const login = async (req, res) => {
    try {
        const { username, password } = req.body

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

        if (!user.active) return res.status(403).json({
            message: 'Account disabled'
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

const logout = async(req, res) => {
    const user = await User.findOne({ where: { id: req.user.id } })
    user.token = null;
    user.save();

    return res.status(200).json({
        message: 'Logout successful'
    })
}

/**
 * Génère un token de réinitialisation de mot de passe et le stocke dans two_step_code.
 * Dans un vrai projet, ce token serait envoyé par email.
 * Body: { email }
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ where: { email } });
        // Réponse identique même si l'user n'existe pas (sécurité : évite l'énumération d'emails)
        if (!user) return res.status(200).json({ message: 'If an account exists for this email, a reset token has been generated' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.two_step_code = resetToken;
        await user.save();

        // Dans un vrai projet : envoyer resetToken par email
        // Pour les besoins du TP, on retourne le token directement
        return res.status(200).json({
            message: 'Reset token generated',
            reset_token: resetToken
        });
    } catch (err) {
        return res.status(400).json({ message: 'Error on forgot password', stacktrace: err.message });
    }
}

/**
 * Réinitialise le mot de passe à partir du token de reset.
 * Body: { reset_token, password }
 */
const resetPassword = async (req, res) => {
    try {
        const { reset_token, password } = req.body;
        if (!reset_token || !password) return res.status(400).json({ message: 'reset_token and password are required' });

        const user = await User.findOne({ where: { two_step_code: reset_token } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));
        user.password = hashedPassword;
        user.two_step_code = null;
        user.token = null;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        return res.status(400).json({ message: 'Error on password reset', stacktrace: err.message });
    }
}

module.exports = {
    login,
    logout,
    forgotPassword,
    resetPassword
}