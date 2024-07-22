const fs = require("fs");
const path = require("path");
const User = require("mongoose").model("User");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// const passportJWTOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: PUB_KEY || secret_phrase,
//   issuer: "enter issuer here",
//   audience: "enter audience here",
//   algorithm: ["RS256"],
//   ignoreExpiration: false,
//   passReqToCallback: false,
//   jsonWebTokenOptions: {
//     complete: false,
//     clockTolerance: "",
//     maxAge: "2d",
//     clockTimestamp: "100",
//     nonce: "String here for OpenID",
//   },
// };

// Authorization: Bearer <token>

// TODO
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new JwtStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

// TODO
module.exports = (passport) => {
  passport.use(strategy);
};
