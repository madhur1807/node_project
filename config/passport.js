const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'name',    // define the parameter in req.body that passport can use as username and password
        passwordField: 'password',
        passReqToCallback: true
    }, (req, name, password, done) => {
        // Match user
        User.findOne({
            name: req.body.name
        }).then( user => {
            if(!user){
                return done(null, false, { message: 'No user found'});
            }
            // Match password
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                     return done(null, false, { message: 'Password Incorrect'});
                }
            })
        });
    }));  

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}