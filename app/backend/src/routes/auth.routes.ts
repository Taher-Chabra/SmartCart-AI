import express from 'express';
import passport from 'passport';
import {
  sendCodeToEmail,
  registerUser,
  localUserLogin,
  logoutUser,
  googleUserLogin,
  chooseRole,
  refreshAccessToken,
  verifyCode,
  completeProfileCreation,
} from '../controllers/auth.controller';
import { verifyJWTAuth } from '../middlewares/auth.middleware';

const router: express.Router = express.Router();

router.route('/login-google').get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router
  .route('/google/callback')
  .get(passport.authenticate('google', { session: false }), googleUserLogin);

router.route('/login').post(localUserLogin);

router.route('/register').post(registerUser);

router.route('/send-verification-code').post(verifyJWTAuth, sendCodeToEmail);

router.route('/verify-code').post(verifyJWTAuth, verifyCode);

router.route('/complete-profile').post(verifyJWTAuth, completeProfileCreation);

router.route('/:userId/choose-role').post(verifyJWTAuth, chooseRole);

router.route('/refresh-token').post(verifyJWTAuth, refreshAccessToken);

router.route('/logout').post(verifyJWTAuth, logoutUser);

export default router;
