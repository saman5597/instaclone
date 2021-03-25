const Post = require('../models/post')

exports.createPost = async (req, res) => {
    try {

        const { title, body, imageUrl } = req.body

        if (!title || !body || !imageUrl) {
            return res.status(400).json({ status: false, message: 'Please add all the fields.' })
        }

        const post = new Post({
            title,
            body,
            imageUrl,
            postedBy: req.currentUser
        })

        await post.save()
        res.status(200).json({ status: true, message: "Image successfully posted!" })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.viewAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("postedBy", "_id fullName profilePic")
        res.status(200).json({ status: true, posts })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.viewFollowingPosts = async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: { $in: req.currentUser.following } }).populate("postedBy", "_id fullName profilePic")
        res.status(200).json({ status: true, posts })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.viewMyProfile = async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: req.currentUser._id }).populate("postedBy", "_id fullName profilePic")

        res.json({ status: true, user: req.currentUser, posts })

    } catch (error) {
        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.likeGetter = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.currentUser._id }
    }, {
        new: true
    }).populate("postedBy", "_id fullName profilePic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ status: false, error: err })
            } else {
                res.status(200).json({ status: true, result })
            }
        })
}

exports.unlikeGetter = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.currentUser._id }
    }, {
        new: true
    }).populate("postedBy", "_id fullName profilePic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ status: false, error: err })
            } else {
                res.status(200).json({ status: true, result })
            }
        })
}

exports.postComment = (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.currentUser._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id fullName profilePic")
        .populate("postedBy", "_id fullName profilePic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ status: false, error: err })
            } else {
                res.status(200).json({ status: true, result })
            }
        })
}

exports.deletePost = (req, res) => {
    Post.findOne({ _id: req.body.postId }).populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ status: false, error: err })
            }
            if (post.postedBy._id.toString() === req.currentUser._id.toString()) {
                post.remove()
                    .then(result => {
                        res.status(200).json({ status: true, message: "Post deleted successfully!", result })
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
}
