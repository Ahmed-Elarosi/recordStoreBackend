import createError from 'http-errors';

// The error handling middleware has an additional first parameter: the error
export const handleErrors = (err, req, res, next) => {
    // err.status (e.g. 404)
    // err.message ('Resource not found')
    // Send an error status code: either what the thrown error wants, or 500
    // Send a JSON object with the error message (which you might want to display in the frontend)
    res
        .status(err.status || 500)
        .send({
            error: {
                message: err.message || 'Server Error 💩️',
                details: err.details || null
            }
        });
}

// Middleware that, when run, creates a 4040 error, and nexts it

export const throw404 = (req, res, next) => {
    // With http-errors, we can write less code, and do not need to remember status codes :)
    const newError = new createError.NotFound();
    next(newError);
};

