const { checkSchema } = require('express-validator')

async function validateSinistre(req, res, next) {
    const [ hasError ] = await checkSchema({
        plate: { notEmpty: true },
        driver_firstname: { notEmpty: true },
        driver_lastname: { notEmpty: true },
        call_datetime: { notEmpty: true },
        sinister_datetime: { notEmpty: true }
    }).run(req);

    if (hasError.isEmpty()) {
        return next();
    }
    res.status(400).json({
        message: 'Missing required sinistre fields'
    }).send();
}

module.exports = {
    validateSinistre
}
