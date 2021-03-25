const express = require('express')
const cors = require('cors')

// Starting express app
const app = express()

//Global Middlewares
app.use(cors()) //for CORS

app.options('*', cors())

// Body-parsing , reading data from body into req.body
app.use(express.json())

// Mounting the routers
app.use('/api/v1/auth', require('./routes/authRoute'))
app.use('/api/v1/posts', require('./routes/postRoute'))
app.use('/api/v1/users', require('./routes/userRoute'))

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.send(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({
            success: false,
            message: 'Not authenticated.'
        })
    }
})

module.exports = app