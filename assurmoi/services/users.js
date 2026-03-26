const { Op } = require('sequelize');
const { User, dbInstance } = require('../models')
const bcrypt = require('bcrypt')
require('dotenv').config()

const getAllUsers = async (req, res) => {
    let queryParam = {};
    if(req.query?.search) {
        queryParam = {
            where: {
                firstname : {
                    [Op.like]: `%${req.query.search}%`
                }
            }
        }
    }
    const users = await User.findAll(queryParam);
    res.status(200).json({
        users: user.clean()
    })
}

const getUser = async (req, res) => {
    const id = req.params.id;
    // const user = await User.findByPk(id);
    const user = await User.findOne({
        where: { id }
    })
    res.status(200).json({
        user: user.clean()
    })
}

const createUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { username, firstname, lastname, email, password } = req.body
        console.log("test 1");
        const hashedpassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));
        console.log("test 2");
        const user = await User.create({
            username,
            firstname,
            lastname,
            email,
            password: hashedpassword,
            active: active ?? true
        }, { transaction })

        console.log("test 3");

        transaction.commit();
        return res.status(201).json({
            user
        })
    } catch(err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on user creation',
            stacktrace: err.errors
        })
    }
}

const updateUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { username, firstname, lastname, email, password, role, token, refresh_token, two_step_code, active } = req.body
        const user_id = req.params.id
        // meilleur manière de mettre à jour :
        const user = await User.update({
            username,
            firstname,
            lastname,
            email,
            password,
            role,
            token,
            refresh_token,
            two_step_code,
            active
        }, {
            where: { id: user_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: "Successfuly updated",
            user
        })
    } catch(err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on user update',
            stacktrace: err.errors
        })
    }
}

const deleteUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const user_id = req.params.id
        
        const status = await User.destroy({
            where: { id: user_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: "Successfuly deleted",
            status
        })
    } catch(err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on user deletion',
            stacktrace: err.errors
        })
    }
}

/**
 * Active un compte utilisateur (superadmin uniquement).
 */
const activateUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const user_id = req.params.id;
        const user = await User.findByPk(user_id);
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.active) {
            await transaction.rollback();
            return res.status(400).json({ message: 'User is already active' });
        }
        await User.update({ active: true }, { where: { id: user_id }, transaction });
        await transaction.commit();
        return res.status(200).json({ message: 'User activated' });
    } catch (err) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Error on user activation', stacktrace: err.errors ?? err.message });
    }
}

/**
 * Désactive un compte utilisateur sans le supprimer (superadmin uniquement).
 */
const deactivateUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const user_id = req.params.id;
        const user = await User.findByPk(user_id);
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.active) {
            await transaction.rollback();
            return res.status(400).json({ message: 'User is already inactive' });
        }
        // Invalider le token actif en même temps
        await User.update({ active: false, token: null }, { where: { id: user_id }, transaction });
        await transaction.commit();
        return res.status(200).json({ message: 'User deactivated' });
    } catch (err) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Error on user deactivation', stacktrace: err.errors ?? err.message });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser
}