const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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
    }
}