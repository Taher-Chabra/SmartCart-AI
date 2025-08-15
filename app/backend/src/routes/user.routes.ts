import express from 'express';
import { verifyJWTAuth } from '../middlewares/auth.middleware';
import {
  getUser,
  removeUserProfile,
  uploadUserProfile,
} from '../controllers/user.controller';
import { upload } from '../middlewares/multer.middleware';

const router: express.Router = express.Router();

router.use(verifyJWTAuth);

router.route('/getUser').get(getUser);

router.route('/upload-avatar').post(upload.single('avatar'), uploadUserProfile);

router.route('/remove-avatar').delete(removeUserProfile);

export default router;
