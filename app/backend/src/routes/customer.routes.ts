import express from 'express';
import { updateCustomerAddress } from '../controllers/customer.controller';
import { verifyJWTAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router: express.Router = express.Router();
router.use(verifyJWTAuth, requireRole('customer'))

router.route('/update-address').put(updateCustomerAddress);
