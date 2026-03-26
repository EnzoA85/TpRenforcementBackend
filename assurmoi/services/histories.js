const { History, Request, Sinistre, User, dbInstance } = require('../models')

const getAllHistories = async (req, res) => {
    let queryParam = {
        include: [
            { model: Request, as: 'Request' },
            { model: Sinistre, as: 'Sinistre' },
            { model: User, as: 'User' }
        ],
        order: [['createdAt', 'DESC']]
    };
    if (req.query?.sinistre_id) {
        queryParam.where = { sinistre_id: req.query.sinistre_id }
    } else if (req.query?.request_id) {
        queryParam.where = { request_id: req.query.request_id }
    }
    const histories = await History.findAll(queryParam);
    res.status(200).json({
        histories
    })
}

const getHistory = async (req, res) => {
    const id = req.params.id;
    const history = await History.findOne({
        where: { id },
        include: [
            { model: Request, as: 'Request' },
            { model: Sinistre, as: 'Sinistre' },
            { model: User, as: 'User' }
        ]
    })
    res.status(200).json({
        history
    })
}

const createHistory = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { request_id, sinistre_id, user_id, update_details } = req.body

        const history = await History.create({
            request_id,
            sinistre_id,
            user_id,
            update_details,
            createdAt: new Date()
        }, { transaction })

        transaction.commit();
        return res.status(201).json({
            history
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on history creation',
            stacktrace: err.errors
        })
    }
}

const deleteHistory = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const history_id = req.params.id

        const status = await History.destroy({
            where: { id: history_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: 'Successfuly deleted',
            status
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on history deletion',
            stacktrace: err.errors
        })
    }
}

module.exports = {
    getAllHistories,
    getHistory,
    createHistory,
    deleteHistory
}
