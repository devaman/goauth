const passport = require("passport"),
GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
require('dotenv').config()
// #1
passport.use(
    new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV==="production"?"https://goauthheroku.herokuapp.com/auth/google/callback":"http://localhost:8080/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                console.log("profile.id: " + profile);
                return done(null, profile); // that is being serealized(added in session)
            });
        }
    )
);
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });