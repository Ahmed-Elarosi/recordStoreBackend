const setCors = (req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, x-Requested-With, Content-Type, Accept, x-auth-token',
        'Access-Control-Expose-Headers': 'x-auth-token'
    });
    next();
};

export default setCors;
