// passportConfig.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./userModel');

const initializePassport = (passport) => {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email });
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email or password.' });
                    }

                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect email or password.' });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
};

module.exports = initializePassport;
