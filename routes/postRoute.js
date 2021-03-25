const postController = require('../controllers/postController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.use(authMiddleware.isSignedIn, authMiddleware.checkAuth)

router.route('/').post(postController.createPost)

router.route('/').get(postController.viewAllPosts)

router.route('/getFollowingPosts').get(postController.viewFollowingPosts)

router.route('/myProfile').get(postController.viewMyProfile)

router.route('/like').put(postController.likeGetter)

router.route('/comment').put(postController.postComment)

router.route('/unlike').put(postController.unlikeGetter)

router.route('/deletePost').delete(postController.deletePost)

module.exports = router