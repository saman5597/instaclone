const express = require('express')
require('dotenv').config({ path: './config.env' });
const connectToDB = require('./dbConfig')

process.on('uncaughtException', err => {
  console.log('Shutting down app...')
  console.log(err.name, err.message)
  process.exit(1)
})

const app = require('./app')

connectToDB()

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`)
})

process.on('unhandledRejection', err => {
  console.log('Shutting down app...')
  server.close(() => {
    console.log(err.name, err.message)
    process.exit(1)
  })
})

