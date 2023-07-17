const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get("/signup", (req, res) => {
    res.render('authentication');
})

router.post("/create-user", (req, res) => {

    const { email, password } = req.body;

    User.findOne({email: email}, (err, foundUser) => {
        if(!foundUser){
            const newUser = new User({
                email: email,
                password: password
            })

            newUser.save()
            res.redirect('/signup')
        }
        else{
            console.log('User Already Exists!');

            if( foundUser.password === password){
                res.render("list")
            }
            else{
                console.log('not verified');
                res.redirect('/signup')
            }
        }
    })
})

module.exports = router;