const { User } = require('../models')

const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({
        user: []
    })
}

const getUser = async (req, res) => {
    const id = req.params.id
    // const user = await User.findByPk(id);
    const user = await User.findOne({
        where: { id }
    })
    res.status(200).json({
        user
    })
}

const createUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try{
        const { username, firstname, lastname, email, password } = req.body;
        const user = await User.create({
            username,
            firstname,
            lastname,
            email,
            password
        }, { transaction })

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
    try{
        const { username, firstname, lastname, email, password } = req.body;
        const user_id = req.params.id
        const user = await User.update({
            username,
            firstname,
            lastname,
            email,
            password
        }, { 
            where: { id: user_id },
            transaction
         })

        transaction.commit();
        return res.status(201).json({
            message: "Successfuly updated",
            user
        })
    } catch(err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on user updated',
            stacktrace: err.errors
        })
    }
}

const deleteUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try{
        const user_id = req.params.id
        
        const status = await User.destroy({
            where: { id: user_id },
            transaction
         })

        transaction.commit();
        res.status(200).json({
            message: "Successfuly delete"
        })
    } catch(err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on user deletion',
            stacktrace: err.errors
        })
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}