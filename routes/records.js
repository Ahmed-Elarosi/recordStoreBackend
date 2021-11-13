// To use a router, we need to import it...
import { Router } from 'express';
import {
    getRecords,
    addRecord,
    getSingleRecord,
    deleteRecord,
    updateRecord,
    get1990sRecords,
    getRecordsByYear
} from '../controllers/records.js';

import { verifyLogin } from '../middleware/authentication.js';

// ...and create a middleware function by calling Router
const recordsRouter = Router();

// In the router, we can now define what should happen for specific subroutes
// Caveat: the path definitions start after middleware routing has taken place:
// '/api/v1/records' ==> '/'
// You can chain methods, or define them separately
recordsRouter.route('/').get(verifyLogin, getRecords).post(verifyLogin, addRecord);

recordsRouter.route('/years/1990s').get(verifyLogin, get1990sRecords);
recordsRouter.route('/years/:year').get(verifyLogin, getRecordsByYear);

// You can define a dynamic route segment with ":", which will be available under req.params
recordsRouter
    .route('/:id')
    .get(verifyLogin, getSingleRecord)
    .put(verifyLogin, updateRecord)
    .delete(verifyLogin, deleteRecord);

export default recordsRouter;
