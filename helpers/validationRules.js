import { body, sanitizeBody } from 'express-validator';

// Express excepts not only comma-separated middlewares, but also an array of middlewares
// You can combine validation and sanitization methods
// You can chain methods to do multiple checks or provide custom messages
// To check multiple fields, simply add one middleware per field
export const validationRulesPOST = [
    body('email').isEmail().withMessage('Not a valid e-mail address').trim().escape().normalizeEmail(),
    body('firstName').isAlpha().withMessage('Only letters allowed').trim().escape(),
    body('lastName').isAlpha().withMessage('Only letters allowed').trim().escape(),
    // body('alias').optional().isAlphanumeric().withMessage('Only letters and numbers allowed').isLength({ min: 10, max: 30}).withMessage('Must be between 10 and 30 characters long'),
    // In order to check for a very specific rule, we can use Regular Expressions via matches()
    body('alias').optional().matches(/^[A-Za-z0-9]{4,15}DCI$/).withMessage('Alias must be between 7 and 18 characters long, and must end with DCI').trim().escape(),
    body('billingAddress.street').trim().escape()
];

export const validationRulesPUT = [
    body('email').optional().isEmail().withMessage('Not a valid e-mail address').trim().escape().normalizeEmail(),
    body('firstName').optional().isAlpha().withMessage('Only letters allowed').trim().escape(),
    body('lastName').optional().isAlpha().withMessage('Only letters allowed').trim().escape(),
    body('alias').optional().matches(/^[A-Za-z0-9]{4,15}DCI$/).withMessage('Alias must be between 7 and 18 characters long, and must end with DCI').trim().escape(),
    body('billingAddress.street').optional().trim().escape()
];