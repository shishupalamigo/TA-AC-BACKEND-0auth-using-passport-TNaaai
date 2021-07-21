var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/User');

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.email,
        profilePic: profile._json.avatar_url
    }
    console.log(profileData);
    User.findOne({ username: profile.username }, (err, user) => {
        if(err) return done(err);
        if(!user) {
            User.create(profileData, (err, addedUser) => {
                if(err) return done(err);
                return done(null, addedUser);
            })
        }
        done(null, user);
    })
}));
