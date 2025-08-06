import express from 'express';
import { verifyJWTAuth } from '../middlewares/auth.middleware';
import { getUser } from '../controllers/user.controller';

const router: express.Router = express.Router();

router.use(verifyJWTAuth);

router.route('/getUser').get(getUser);

export default router;
