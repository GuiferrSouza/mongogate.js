const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');

function initializePassport(app, userModel, config) {
    const { userField, passwordField, hashedPassword, sessionExpiration, sessionSecret } = config;
    const defaultSessionSecret = crypto.randomBytes(16).toString('hex');

    app.use(session({
        secret: sessionSecret || defaultSessionSecret,
        resave: false, saveUninitialized: false,
        cookie: sessionExpiration ? { maxAge: sessionExpiration } : {}
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({ usernameField: userField, passwordField: passwordField },
        async (username, password, done) => {
            try {
                const existingUser = await userModel.findOne({ [userField]: username });
                if (!existingUser) return done(null, false, { message: 'User not found' });

                const isMatch = hashedPassword ?
                    await bcrypt.compare(password, existingUser[passwordField]) :
                    password === existingUser[passwordField];

                if (!isMatch) return done(null, false, { message: 'Incorrect password' });
                return done(null, existingUser);
            } catch (err) {
                return done(err);
            }
        }));

    passport.serializeUser((existingUser, done) => done(null, existingUser.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initializePassport;