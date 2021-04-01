
const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    app = express(),
    passport = require("passport"),
    pass = require('./passport'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    webpush = require('web-push'),
    serve = require('express-static');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Replace with your email
webpush.setVapidDetails('mailto:chambialamit@gmail.com', publicVapidKey, privateVapidKey);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['goauth'],
    maxAge: 7 * 24 * 60 * 60 * 1000,
}))
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// #1
app.get("/auth/google",
    passport.authenticate(
        "google", {
        scope: ["profile", "email"]
    }));
app.post('/btn', (req, res) => {
    const subscription = req.body;
    console.log("btn", subscription);
    const payload = JSON.stringify({ title: 'test' });
    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
    res.json({success:true})
})
// #2
app.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/google_callback_fail",
        successRedirect: "/",
        scope: ["profile", "email"]
    })
);
//subscribe event
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});

});
app.get("/", isLoggedIn, function (req, res) {
    res.render('profile1', { user: req.user, picture: req.user._json.picture.split("=")[0] })
});
app.get("/profile2", isLoggedIn, function (req, res) {
    res.render('profile', { user: req.user, picture: req.user._json.picture.split("=")[0] })
});
app.get('/logout', function (req, res) {
    req.session = null;
    res.redirect('/signin')
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("isAuthenticated TRUE");
        return next();
    }
    res.redirect("/signin");
}

app.get("/signin", function (req, res) {
    console.log("req.user: " + req.user);
    res.render('login')
});

app.get("/google_callback_fail", function (req, res) {
    res.json("the callback after google DID NOT authenticate the user");
});
app.use(serve(__dirname + '/public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT);