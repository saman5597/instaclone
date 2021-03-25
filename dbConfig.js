const mongoose = require('mongoose')

function connectToDB() {

    // Database Connection
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    mongoose.connection.on('connected', () => {
        console.log('Database connected.')
    })

    mongoose.connection.on('error', () => {
        console.log('Error connecting database.')
    })
}

module.exports = connectToDB