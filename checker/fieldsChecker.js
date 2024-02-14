const validator = require('validator');
const {emptyFieldsSignUpError, emptyFieldsSignInError, emailInvalid, passwordInvalid} = require('../messages/errorMsg');

const emptyFieldsError = {
    'sign-up': emptyFieldsSignUpError,
    'sign-in': emptyFieldsSignInError
};
const checkCommonFields = (req, res) => {
    if (!validator.isEmail(req.body.email)) return res.status(400).json({message: emailInvalid});
    if (!validator.isStrongPassword(req.body.password)) return res
        .status(400)
        .json({message: passwordInvalid});
    return null;
};

const checkFields = (req, res, type) => {
    const errors = emptyFieldsError[type];
    for (const field in errors) {
        if (!req.body[field]) return res.status(400).json({message: errors[field]});
    }
    const error = checkCommonFields(req, res);
    if (error) return error;
    return null;
};

module.exports = { checkFields }
