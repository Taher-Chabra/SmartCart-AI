"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = configurePassport;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../models/user.model");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await user_model_1.User.findOne({ 'google.id': profile.id });
        if (existingUser) {
            if (existingUser.authType === 'local') {
                existingUser.authType = 'google';
                await existingUser.save();
            }
            return done(null, existingUser);
        }
        else {
            const newUser = await user_model_1.User.create({
                fullName: profile.displayName,
                email: profile?.emails?.[0]?.value,
                google: {
                    id: profile.id
                },
                authType: 'google'
            });
            return done(null, newUser);
        }
    }
    catch (error) {
        return done(error);
    }
}));
function configurePassport(app) {
    app.use(passport_1.default.initialize());
}
