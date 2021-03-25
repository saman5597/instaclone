const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.route('/signup').post(authController.signUp)

router.route('/login').post(authController.login)

router.get('/logout', authController.logout)

module.exports = router