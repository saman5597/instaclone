const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.use(authMiddleware.isSignedIn, authMiddleware.checkAuth)

router.route('/:userId').get(userController.getUserByUserId)

router.route('/followUser').put(userController.followUser)

router.route('/unfollowUser').put(userController.unfollowUser)

router.route('/updateProfilePic').put(userController.updateProfilePic)

router.route('/editProfile').put(userController.updateName)

router.route('/searchUsers').post(userController.searchUsers)

module.exports = router