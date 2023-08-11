const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require("jsonwebtoken")

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

    const { name, email, password } = req.body;

    User.findOne({email: email}, (err, foundUser) => {
        if(!foundUser){
            const newUser = new User({
                name: name,
                email: email,
                password: password
            })

            newUser.save()
            res.redirect('/signin')
        }
        else{
            res.render("error", { errorMsg: "User Already Exists please Sign in!", errorCode: 409, redirectPage: '/signin'});
        }
    })
})

router.post("/signin-user", (req, res) => {

    const { email, password } = req.body;

    User.findOne({email: email}, (err, foundUser) => {
        if(!foundUser){
            res.render("error", { errorMsg: "No user registered with this credential, Sign up first!", errorCode: 401, redirectPage: '/signup'});
        }
        else{
            if(password !== foundUser.password){
                res.render("error", { errorMsg: "Wrong Password!", errorCode: 401, redirectPage: '/signin'});
            }
            else{
                // Generating JWT token
                const token = jwt.sign({ id: foundUser._id, useremail: foundUser.email, username: foundUser.name}, process.env.JWT_SECRET, {
                    expiresIn: '1h', // expiration time
                })
                
                res.cookie('token', token, { httpOnly: true})
                res.redirect('/read-all')
            }
        }
        if(err){
            res.render("error", { errorMsg: "Something Went Wrong!", errorCode: 500, redirectPage: '/signin'});
        }
    })
})

module.exports = router;