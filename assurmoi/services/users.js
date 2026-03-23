const getAllUsers = (req, res) => {
    res.status(200).json({
        user: []
    })
}

const getUser = (req, res) => {
    res.status(200).json({
        user: req.params.id
    })
}

const createUser = (req, res) => {
    const user = req.body;
    res.status(201).json({
        user
    })
}

const updateUser = (req, res) => {
    res.status(200).json({
        message: "Successfuly updated"
    })
}

const deleteUser = (req, res) => {
    res.status(200).json({
        message: "Successfuly delete"
    })
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}