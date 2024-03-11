const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var routes = require("./routes");
const connection = require("./config/database");
const bodyParser = require("body-parser");

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo");

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
var app = express();
const PORT = process.env.PORT || 9999;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = MongoStore.create({
  clientPromise: connection,
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize()); // it rerun passport every route
app.use(passport.session()); // initialize session and if session exist use this session

app.use((req, res, next) => {
  console.log("---------------------------------");
  console.log("req.session", req.session);
  console.log("req.user", req.user);
  next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

app.use((req, res, next) => {
  res.status(404).send("<h1>404! Sorry can't find that!</h1>");
});

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:${PORT}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
