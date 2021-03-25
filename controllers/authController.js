const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const signToken = id => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createJWT = (userId, res) => {

    const token = signToken(userId)

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRY_DT * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: false
    })
}

exports.signUp = (req, res) => {
    try {

        const { fullName, email, password, profilePic } = req.body

        if (!fullName || !email || !password) {
            return res.status(400).json({ status: false, message: 'Please add all the fields.' })
        }

        User.findOne({ email }).then(async savedUser => {

            if (savedUser) {
                return res.status(409).json({ status: false, message: 'User already exists with that email.' })
            }

            await bcrypt.hash(password, 12).then(async hashedPassword => {
                const user = new User({
                    fullName,
                    email,
                    password: hashedPassword,
                    profilePic
                })

                await user.save()
                createJWT(user._id, res)
                res.status(200).json({
                    status: true,
                    message: "User signed up successfully!"
                })
            })
        }).catch(err => {
            console.log(err.message)
            res.status(400).json({ status: false, message: err.message })
        })

    } catch (err) {

        // handling duplicate key
        if (err && err.code === 11000) {
            return res.status(409).json({ status: false, message: 'Duplicate data found.' })
        }

        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Please provide your credentials.' })
        }

        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ status: false, message: 'Incorrect credentials.' })
        }

        await bcrypt.compare(password, user.password).then(isMatched => {
            if (!isMatched) {
                return res.status(401).json({ status: false, message: 'Incorrect credentials.' })
            }
            user.password = undefined
            createJWT(user._id, res)
            res.status(200).json({
                status: true,
                message: "User logged in successfully!",
                user
            })
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.logout = (req, res) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 1000),
        secure: false,
        httpOnly: false
    }
    res.cookie('jwt', 'loggedout', cookieOptions)
    res.status(200).json({ status: 'success', message: "Logged out successfully !" })
}