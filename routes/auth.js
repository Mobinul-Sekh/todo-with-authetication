const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
    res.redirect('/signin');
})

router.get("/signin", (req, res) => {
    res.render('signin');
})

router.get("/signup", (req, res) => {
    res.render('signup');
})

router.get("/signout", (req, res) => {
    res.cookie('token', null, {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.redirect('/signin')
})

router.post("/create-user", (req, res) => {

    const { name, email, password, confirmPassword } = req.body;

    if ( password.length < 6 ) {
        res.render("error", { errorMsg: "Password length must be 6 characters.", errorCode: 409, redirectPage: '/signup'});
    }
    else if ( password !== confirmPassword ) {
        res.render("error", { errorMsg: "Password and Confirm Password do not match!", errorCode: 409, redirectPage: '/signup'});
    }
    else {
        User.findOne({email: email}, async (err, foundUser) => {
            if(!foundUser){

                const hashPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashPassword
                })
    
                newUser.save()
                res.redirect('/signin')
            }
            else{
                res.render("error", { errorMsg: "User Already Exists please Sign in!", errorCode: 409, redirectPage: '/signin'});
            }
        })
    }
})

router.post("/signin-user", (req, res) => {

    const { email, password } = req.body;

    User.findOne({email: email}, async (err, foundUser) => {
        if(!foundUser){
            res.render("error", { errorMsg: "No user registered with this credential, Sign up first!", errorCode: 401, redirectPage: '/signup'});
        }
        else{
            const validPassword = await bcrypt.compare(password, foundUser.password);
            
            if (!validPassword) {
                res.render("error", { errorMsg: "Wrong Password!", errorCode: 401, redirectPage: '/signin'});
            }
            else{
                // Generating JWT token
                const token = jwt.sign({ id: foundUser._id, useremail: foundUser.email, username: foundUser.name}, process.env.JWT_SECRET, {
                    expiresIn: '1h', // expiration time
                })
                
                res.cookie('token', token, { 
                    httpOnly: true,
                })
                res.redirect('/read-all')
            }
        }
        if(err){
            res.render("error", { errorMsg: "Something Went Wrong!", errorCode: 500, redirectPage: '/signin'});
        }
    })
})

module.exports = router;