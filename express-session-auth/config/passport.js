const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const { User } = require("../models/User");
const validPassword = require("../lib/passwordUtils").validPassword;

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  await User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      const isValid = validPassword(password, user.hash, user.salt);

      if (!isValid) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch((err) => done(err));
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
