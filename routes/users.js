import { Router } from 'express';
// Import the body middleware to check inside req.body (or any other to check anywhere else)

import { getUsers, addUser, getSingleUser, updateUser, deleteUser, loginUser } from '../controllers/users.js';
import validateWith from '../middleware/validation.js';
import { validationRulesPOST, validationRulesPUT } from '../helpers/validationRules.js';
import { verifyLogin, verifyAdmin, verifyIsUserOrAdmin } from '../middleware/authentication.js';

const usersRouter = Router();

usersRouter.route('/').get(verifyLogin, verifyAdmin, getUsers);

usersRouter
    .route('/:id')
    .get(verifyLogin, verifyIsUserOrAdmin, getSingleUser)
    .put(verifyLogin, verifyIsUserOrAdmin, validateWith(validationRulesPUT), updateUser)
    .delete(verifyLogin, verifyIsUserOrAdmin, deleteUser);

// Move POST User to a /signup endpoint
usersRouter.route('/signup').post(validateWith(validationRulesPOST), addUser);

// Add a POST /login route for authentication
usersRouter.route('/login').post(loginUser);

export default usersRouter;
