var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var router = express.Router();

//Load user model
require('../models/Users');
var User = mongoose.model('Users');

//route to register user
router.get('/register', function(req, res){
    res.render('users/register');
});

router.post('/register', function(req,res){  
    var errors = [];  

    if(req.body.password != req.body.password2)
    {
        errors.push({text:"Passwords do not match"});
    }

    if(req.body.password.length < 4)
    {
        errors.push({text:"Password is less than 4 characters"})
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors:errors,
            name:req.body.name, 
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2 
        });
    }
    else
    {
        User.findOne({email:req.body.email})
        .then(function(user){
            if(user){
                //add flash msg
            res.redirect("/users/register");
            }
            else{
                var newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
            
                });

                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, salt, function(err, hash){
                        if(err)throw err;
                        newUser.password = hash;
                        new User(newUser)
                        .save()
                        .then(function(user){
                            res.redirect('/login');
                            }
                        ).catch(function(err){
                            console.log(err);
                            return;
                        })
                    });
                })
            }
        })
    }

/*
    var newUser = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password

    }

    new User(newUser)
    .save()
    .then(function(user){
        res.redirect('/');
    });
*/    
});

module.exports = router;