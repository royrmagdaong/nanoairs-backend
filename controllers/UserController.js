const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    getUser: async (req, res) => {
        try {
            return res.status(200).json({ message: 'success' })
        } catch (error) {
            return res.status(500).json({message: 'error'})
        }
    },
    createUser: async (req, res) => {
        let saltRounds = 10

        try {
            let role = req.body.role
            let email = req.body.email
            let password = req.body.password

            bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
                
                if(err) res.status(500).json({error: true, message: err.message})

                let user = await new User({
                    role: role,
                    email: email,
                    password: hashedPassword
                })

                await user.save().then(savedUser => {
                    res.status(200).json({newUser: savedUser, message: 'user created'})
                });
            });

        } catch (error) {
            res.status(500).json({error: true, message: error.message})
        }
    },
    signIn: async (req, res) => {
        let user
        let email = req.body.email
        let password = req.body.password

        try {
            user = await User.findOne({email: email}).exec()
            if(user){
                if(user.is_verified){
                    let hashPassword = user.password
                    bcrypt.compare(password, hashPassword, (err, matched) => {
                        if(err) res.status(500).json({response: false, message: err.message})
                        else {
                            if(matched){
                                jwt.sign({ email: user.email, role: user.role, _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' }, async (err, token) =>{
                                    if(err) res.status(500).json({response: false, message: err.message})
                                    if(token){
                                        return res.status(200).json({
                                            data: { _id: user._id, role: user.role, email: user.email, token },
                                            response: true
                                        })
                                    }
                                });
                            }else{
                                res.status(403).json({ response: false, message: "incorrect password" })
                            }
                        }
                    })
                }else{
                    res.status(403).json({ response: false, message: "email is not verified", user: {email: user.email, role: user.role} })
                }
            }else{
                res.status(404).json({ response: false, message: "incorrect email or the email is not registered yet!" })
            }
        } catch (error) {
            res.status(500).json({error: true, message: error.message})
        }
    }
}