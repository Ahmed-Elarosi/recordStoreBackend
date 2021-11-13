import { Router } from 'express';

import { getOrders, addOrder, getSingleOrder, updateOrder, deleteOrder } from '../controllers/orders.js';

import { verifyLogin } from '../middleware/authentication.js';

const ordersRouter = Router();

ordersRouter.route('/').get(verifyLogin, getOrders).post(verifyLogin, addOrder);

ordersRouter
    .route('/:id')
    .get(verifyLogin, getSingleOrder)
    .put(verifyLogin, updateOrder)
    .delete(verifyLogin, deleteOrder);

export default ordersRouter;
