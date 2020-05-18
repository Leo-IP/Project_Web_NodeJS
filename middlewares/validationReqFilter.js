'use strict';
const {validationResult} = require('express-validator/check');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error: {message: 'Bad request'}});
    }
    next();
};