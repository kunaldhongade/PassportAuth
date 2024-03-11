const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = require("../models/User");

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login-success",
    failureRedirect: "/login-failure",
  })
);

router.post("/register", (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  if (User.findOne(req.body.username)) {
    return res.send("User already exists");
  }

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  newUser
    .save()
    .then((user) => {
      console.log("------------routes/index.js--↓---------------");
      console.log(user);
      console.log("---------↑--routes/index.js------------------");
    })
    .catch((err) => console.log(err));

  res.redirect("/login");
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.send(
    '<h1>Home</h1><p>Please <a href="/register">register</a></p><br><p>Please <a href="/login">login</a></p>'
  );
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behavior express session has without a maxAge set
 */
router.get("/protected-route", (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      `<h1>You are not authenticated</h1>
      <p><a href="/login">Login</a></p>`
    );
  }
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  try {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // res.redirect('/');
      res.redirect("/protected-route");
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
