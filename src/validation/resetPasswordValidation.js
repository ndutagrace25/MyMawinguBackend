const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function resetPasswordValidation(data) {
    let errors = {};
    data.phone = !isEmpty(data.phone) ? data.phone : '';

    if (validator.isEmpty(data.phone)) {
        errors.phone = 'Phone is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}