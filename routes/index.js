const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

var bodyparser = bodyParser.json();

// Load user model
require('../models/Users');
const User = mongoose.model('users');

router.get("/", (req, res) => {
    res.render('index');    
});

router.get("/register", (req, res) => {
    res.render('register');
});

router.get("/home", (req, res) => {
    res.render('home');
});

router.post("/register", bodyparser, (req, res) => {
    User.findOne({
            name: req.body.name
        })
        .then( user => {
            if(user){
                res.status(200).json({ 
                    success: false, 
                    message: "User Name Already Exists!" 
                });
                res.end();
            } else{
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                            newUser.password = hash;
                        newUser.save()
                        .then( user => {
                            res.status(200).json({ 
                                success: true, 
                                message: "User Registered Successfully" 
                            });
                        }).catch( err => {
                            console.log(err);
                            return;
                        });
                    });
                });
            }
        });   
});

router.post("/login", (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.status(200).json({ 
                                success: false, 
                                message: err 
                            }); }
        if (!user) { 
            if(info["message"] == "No user found"){
                return  res.status(200).json({ 
                                success: false, 
                                message: "User not found!" 
                            }); 
            } else if(info["message"] == "Password Incorrect"){
                return  res.status(200).json({ 
                                success: false, 
                                message: "Incorrect password!" 
                            }); 
            } 
        } else{
                 return  res.status(200).json({ 
                                user: user.name,
                                success: true, 
                                message: "User authorised" 
                            });
            }
        
    })(req, res, next);
});

module.exports = router;