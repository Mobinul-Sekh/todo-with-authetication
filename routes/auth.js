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
            const response = {
                "msg" : "User Already Exists please Sign in!"
            }
            res.json(response)
        }
    })
})

router.post("/signin-user", (req, res) => {

    const { email, password } = req.body;

    User.findOne({email: email}, (err, foundUser) => {
        if(!foundUser){
            const response = {
                "msg" : "No user registered with this credential, Sign up first!"
            }
            // res.redirect('/signup')
            res.json(response)
        }
        else{
            if(password !== foundUser.password){
                const response = {
                    "msg" : "Password did not match!"
                }
                // res.redirect('/signin')
                res.json(response)
            }
            else{
                // Generating JWT token
                const token = jwt.sign({ id: foundUser._id, useremail: foundUser.email}, process.env.JWT_SECRET, {
                    expiresIn: '1h', // expiration time
                })
                
                res.status(201).json({token})
            }
        }
        if(err){
            console.log("Sign-in err --> ");
        }
    })
})

module.exports = router;