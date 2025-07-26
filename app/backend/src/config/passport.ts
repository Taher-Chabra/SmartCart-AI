import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {
  Strategy as GoogleStrategy
} from 'passport-google-oauth20';
import { User } from '../models/user.model';
import { Express } from 'express';

passport.use(new LocalStrategy(
   {
      usernameField: 'email',
      passwordField: 'password'
   },
   async (email, password, done) => {
      try {
         const user = await User.findOne({ email });
         if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
         }

         const isMatch = await user.comparePassword(password);
         if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
         }

         return done(null, user);
      } catch (error) {
         return done(error);
      }
   }
));

passport.use(new GoogleStrategy(
   {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!
   },
   async (accessToken, refreshToken, profile, done) => {
      try {
         const existingUser = await User.findOne( { 'google.id': profile.id})

         if (existingUser) {
            if (existingUser.authType === 'local') {
               existingUser.authType = 'google';
               await existingUser.save();
            }
            return done(null, existingUser);
         } else {
            const newUser = await User.create({
               fullName: profile.displayName,
               email: profile?.emails?.[0]?.value,
               google: {
                  id: profile.id
               },
               authType: 'google'
            });
            return done(null, newUser);
         }
      } catch (error) {
         return done(error);
      }
   }
));

export function configurePassport( app: Express) {
   app.use(passport.initialize());
}