import express from 'express';
import passport from 'passport';
import { registerUser, localUserLogin, googleUserLogin } from '../controllers/auth.controller';

const router: express.Router = express.Router();

router.route('/register')
   .post(registerUser);

router.route('/login').post(
   passport.authenticate(
      'local', 
      { session: false, failureRedirect: '/login-failure' }
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
      { session: false, failureRedirect: '/login-failure' }
   ),
   googleUserLogin
);

export default router;