const passport = require("passport"),
GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// #1
passport.use(
    new GoogleStrategy({
            clientID: "543976067689-nfovf61l74nb9n59lnda83sfj2um3qat.apps.googleusercontent.com",
            clientSecret: "Byu9oE_3zUpNZuT3xrngt4h9",
            callbackURL: "http://localhost:8080/auth/google/callback"
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