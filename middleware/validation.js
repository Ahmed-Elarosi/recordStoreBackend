import { validationResult } from 'express-validator';
import createError from 'http-errors';

const checkValidationResults = (req, res, next) => {
    try {
        // Here we can check for whether we have validation errors
        // Check for errors with validationResult(req)
        const errors = validationResult(req);
        // If there are any, throw an error
        // Result.isEmpty() will return true if the errors.errors array is empty
        // Result.errors() will return an array of the errors
        // To attach additional data, we cannot use createError.BadRequest()
        // With createError(), we can add the errors as the third argument
        // Here we add details property to the error, and add our errors
        // if (!errors.errors.length > 0) throw new createError(400, 'Validation failed', { details: errors.errors });
        if (!errors.isEmpty()) throw createError(400, 'Validation failed', { details: errors.array().map(({ param, msg }) => ({ field: param, message: msg })) });
        // Otherwise...
        next();
    } catch(err) {
        next(err);
    }
};

const validateWith = (rules) => [ ...rules, checkValidationResults ];

export default validateWith;