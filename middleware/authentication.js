import createError from 'http-errors';

import User from '../models/User.js';

export const verifyLogin = async (req, res, next) => {
    try {
        // We have access to header information via req.header(<header key>);
        const token = req.header('x-auth-token');
        // If there is no token, we will assume that the user is not logged in, and we will throw an error
        if (!token) throw new createError.Unauthorized();
        // Does the token come from us?
        // Does the User referenced by the token ID still exist?
        const verifiedUser = await User.verifyToken(token);
        if (!verifiedUser) throw new createError.Unauthorized();
        // If we have a verified user, attach it to req, we can check for their role in the next middleware
        req.user = verifiedUser;
        next();
    } catch (err) {
        next(err);
    }
};

export const verifyAdmin = (req, res, next) => {
    try {
        // Look into the req.user object we attached with the verifyLogin middleware, and only let requests pass through wher the role is admin
        if (req.user.role !== 'admin') throw new createError.Unauthorized();
        next();
    } catch (err) {
        next(err);
    }
};

export const verifyIsUserOrAdmin = (req, res, next) => {
    try {
        // Caveat: a Mongoose _id is not a String, but an Object
        if (req.params.id !== String(req.user._id) && req.user.role !== 'admin') throw new createError.Unauthorized();
        next();
    } catch (err) {
        next(err);
    }
};

/*
export const verifyRole = role => (req, res, next) => {
    try {
        const roleSystem = ['user', 'editor', 'admin'];
        const roleInSystem = roleSystem.findIndex(item => item === role);
        const indexOfUser = roleSystem.findIndex(item => item === req.user.role);
        if (indexOfUser < roleInSystem) throw new createError.Unauthorized();
        next();
    } catch (err) {
        next(err);
    }
};
*/
