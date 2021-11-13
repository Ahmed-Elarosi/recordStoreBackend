import createError from 'http-errors';

import User from '../models/User.js';

export const getUsers = async (req, res, next) => {
    try {
        const limit = Number.parseInt(req.query.limit) || 100;
        const pageRequested = Number.parseInt(req.query.page) || 1;
        const users = await User.find({})
            // Control the sort order of your results by using Query.prototype.sort()
            // Provide a tie-breaker sort by adding multiple properties
            .sort({ lastName: 1, firstName: 1 })
            // Limit the results returned by unsing Query.prototype.limit()
            .limit(limit)
            // Skip results by using Query.prototype.skip()
            // .skip(5)
            // If you skip based on query parameters, you can implement pagination
            .skip(limit * (pageRequested - 1))
            .select('-password -createdAt -updatedAt -__v');
        res.status(200).send(users);
    } catch (err) {
        next(err);
    }
};

export const addUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        // delete newUser._doc.password;
        res.status(201).send(newUser);
    } catch (err) {
        next(err);
    }
};

export const getSingleUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password -createdAt -updatedAt -__v');
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndRemove(id);
        if (!deleted) throw new createError.NotFound();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated) throw new createError.NotFound();
        res.status(200).send(updated);
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        // We receive a login request with some credentials
        const { email, password } = req.body;
        // Check whether the unique identifier exists
        const userToLogin = await User.findOne({ email });
        if (!userToLogin) throw new createError.Unauthorized();
        // If it exists, does the password match?
        const doPasswordsMatch = await userToLogin.authenticate(password);
        // - If both match, SUCCESS, else FAILURE
        if (!doPasswordsMatch) throw new createError.Unauthorized();
        // Create a token for successful logins
        const token = await userToLogin.generateJWT();
        // Send the token to the client so that they can use it to authenticate themselves
        res.header('x-auth-token', token).status(200).send(userToLogin);
    } catch (err) {
        next(err);
    }
};
