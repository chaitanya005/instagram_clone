const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model ("User")
const bcrypt = require ("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
// const sgMail = require('@sendgrid/mail')
// const API_KEY = require ('../config/keys')

//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
// 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

//instagram     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
const transporter = nodemailer.createTransport(sendgridTransport({
    service  : "Gmail",
    auth:{
        api_key:"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"
    }
}))






router.get ('/protected',requireLogin,(req,res) =>  {
    res.send("hello user")
})


//signup
router.post ('/signup',(req,res) => {
    const {name, email, password, pic} = req.body
    if (!email || !name || !password) {
        return res.json("Fields are missing")
    }
    User.findOne({email:email})
        .then((saveUser) => {
            if (saveUser) {
                return res.json("user already exists")
            }
            //hashing password 
            bcrypt.hash(password, 15) //15 - size of the password
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password:hashedpassword, //assigning the hashed password to password
                        name,
                        pic
                    })
        
                    user.save()
                    .then(user => {
                        // lecture 47
                        transporter.sendMail({
                            to:user.email,
                            from:"chaitanyamuvvala@outlook.com",
                            subject:"signup success",
                            html:"<h1>welcome to instagram</h1>"
                        })
                        // end

                        res.json({message :'user sucessfully saved in Database'})
                    })
                    .catch(err => {
                        console.log (err)
                    })
                })
        })
        .catch(err => {
            console.log (err)
        })
})


//singin

router.post ('/signin',(req,res) => {
    const {email,password} = req.body
    if (!email || !password) {
        return res.json({error: "Please fill the required fields"})
    }
    User.findOne({email:email})
    .then(saveUser => {
        if (!saveUser) {
            return res.json({error:"email and passowrd are mis-match"})
        }
              //comparing the password from front-end and the password which stored in our database
            bcrypt.compare(password, saveUser.password)
            .then(doMatch => {
                if (doMatch) {
                        const token =  jwt.sign({_id:saveUser},JWT_SECRET)
                        const {_id, name, email, followers, following, pic} = saveUser
                        res.json({token,user:{_id, name, email, followers, following, pic}})
                } else {
                    return res.json({error:"Invalid email or password"})
                }
            })
            .catch(err=>{
                console.log (err)
            })
        
    })
})

module.exports = router