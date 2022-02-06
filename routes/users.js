const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');

//Login Page
router.get('/login', (req, res)=>{res.render('login')});

//Register Page
router.get('/register', (req, res)=>{res.render('register')});

//Handle Registration
router.post('/register', (req, res)=>{
    const { name, email, password, password2} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2 ){
        errors.push({msg: 'Please fill in all fields'});
    }

    //Check passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    //Check password length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters long'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //Validation passed
        User.findOne({ email: email})
           .then(user => {
               if(user){
                   //If user exists
                   errors.push({msg: 'email already exists.'})
                   res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
               }
               else{
                   const newUser = new User({
                       name,
                       email,
                       password,
                   });

                   //Hash password
                   bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                       if(err) throw err;

                       //set password to hashed
                       newUser.password = hash;

                       //save user
                       newUser.save()
                         .then(user => {
                            req.flash('success_msg', 'You are now registered') 
                            res.redirect('/users/login')})
                         .catch(err => console.log(err));
                   }))
                   console.log(newUser);
                
               }
           })
    }
})

//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true

    })(req, res, next);
} );

//log out handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;