const validator = require('validator');
const errors = require('../messages/error.msg');

const emptyFieldsErrors = {
    'sign-up': {
        username: errors.emptyField('Username'),
        position: errors.emptyField('Position'),
        email: errors.emptyField('Email'),
        password: errors.emptyField('Password')
    },
    'sign-in': {
        email: errors.emptyField('Email'),
        password: errors.emptyField('Password')
    }
};

const checkValidFields = (req, res) => {
    if (!validator.isEmail(req.body.email)) return res.status(400).json({message: errors.invalidField('Email')});
    if (!validator.isStrongPassword(req.body.password)) return res.status(400).json({message: errors.invalidField('Password'
            + "Please use 8 and more symbols: uppercase, lowercase, numbers and special symbols!")});
    return null;
};

const checkEmptyFields = (req, res, type) => {
    const emptyErrors = emptyFieldsErrors[type];
    for (const fields in emptyErrors){
        if (!req.body[fields]) return res.status(400).json({message: emptyErrors[fields]});
    }
    return null;
}

const checkFields = (req, res, type) => {
    const errorEmpty = checkEmptyFields(req, res, type);
    const errorValid = checkValidFields(req, res);
    if (errorEmpty) return errorEmpty;
    if (errorValid) return errorValid;
};

module.exports = { checkFields }
