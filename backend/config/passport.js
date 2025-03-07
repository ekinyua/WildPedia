const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');
const { google } = require('./auth.config');
const logger = require('../logger');

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: google.callbackURL,
    passReqToCallback: true
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            logger.info(`Google auth attempt for: ${profile.displayName} (${profile.id})`);

            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            if (!email) {
                return done(new Error('Email not provided by Google'), null);
            }

            const user = await userModel.findOrCreateGoogleUser({
                googleId: profile.id,
                email: email,
                displayName: profile.displayName,
                picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null
            });

            return done(null, user);
        } catch (error) {
            logger.error('Error during Google authentication:', error);
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;