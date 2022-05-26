const express = require('express')
const bcrypt = require('bcrypt')
const { expressjwt: expressJwt } = require('express-jwt')
const jwt = require('jsonwebtoken')
const User = require('./user.model')
require('dotenv').config();


const validateJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

const signToken = _id => jwt.sign({ _id }, process.env.SECRET)

const findAndAsignUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(401).end()
        }
        req.user = user;
        next()
    } catch (err) {
        next(err);
    }
}


const isAuthenticated = express.Router().use(validateJwt, findAndAsignUser)


// Handlers
const Auth = {
    login: async (req, res) => {
        const { body } = req;
        try {
            const user = await User.findOne({ email: body.email })
            if (!user) {
                req.status(401).send('User or passwsord invalid.')
            } else {
                const isMatch = await bcrypt.compare(body.passwsord, user.passwsord)
                if (isMatch) {
                    const signedToken = signToken(user._id)
                    res.status(200).send(signedToken)
                } else {
                    req.status(401).send('User or passwsord invalid.')
                }
            }
        } catch (err) {
            res.send(err.message);
        }
    },
    register: async (req, res) => {
        const { body } = req;
        try {
            const isUser = await User.findOne({ email: body.email })
            if (isUser) {
                res.send('The user already exists!')
            } else {
                const salt = await bcrypt.genSalt()
                console.log('salt:' + salt)
                const hashed = await bcrypt.hash(body.password, salt)
                console.log('hashed:' + hashed)
                const user = await User.create({ email: body.email, password: hashed, salt });

                const signedToken = signToken(user._id);
                res.send(signedToken);
            }
        } catch (err) {
            res.status(500).send(err.message)
        }
    },
}

module.exports = { Auth, isAuthenticated }