const expressJWT = require('express-jwt')
const User = require('../models/user')

exports.isSignedIn = expressJWT({ secret: process.env.JWT_SECRET, requestProperty: 'auth', algorithms: ['sha1', 'RS256', 'HS256'] })

exports.checkAuth = async (req, res, next) => {

    try {
        if (!req.auth) {
            return res.status(401).json({ status: false, message: 'You are not logged in. Please login.' })
        }

        const currentUser = await User.findById(req.auth.id)

        if (!currentUser) {
            return res.status(401).json({ status: false, message: 'The user belonging to the token does no longer exist.' })
        }

        req.currentUser = currentUser

        next()

    } catch (err) {
        console.log(err.message)
    }

}