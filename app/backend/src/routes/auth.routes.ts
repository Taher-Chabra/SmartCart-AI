import express from 'express';
import passport from 'passport';
import { registerUser, localUserLogin, logoutUser, googleUserLogin, refreshAccessToken } from '../controllers/auth.controller';
import { verifyJWTAuth } from '../middlewares/auth.middleware';

const router: express.Router = express.Router();

router.route('/register')
   .post(registerUser);

router.route('/login').post(
   passport.authenticate(
      'local', 
      { session: false }
   ),
   localUserLogin
);

router.route('/login-google').get(
   passport.authenticate(
      'google', 
      { scope: ['profile', 'email'], session: false }
   )
);

router.route('/google/callback').get(
   passport.authenticate(
      'google', 
      { session: false }
   ),
   googleUserLogin
);

router.route('/refresh-token').post(
   verifyJWTAuth,
   refreshAccessToken
);

router.route('/logout').post(
   verifyJWTAuth,
   logoutUser
);

export default router;