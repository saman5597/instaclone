const Post = require('../models/post')
const User = require('../models/user')

exports.getUserByUserId = async (req, res) => {
    try {

        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found.' })
        }

        const posts = await Post.find({ postedBy: req.params.userId }).populate("postedBy", "_id fullName profilePic")

        res.status(200).json({ status: true, user, posts })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ status: false, message: 'Internal Server Error.' })
    }
}

exports.followUser = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.currentUser._id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                console.log(err)
                return res.status(422).json({ status: false, message: err })
            }

            User.findByIdAndUpdate(req.currentUser._id, {
                $push: { following: req.body.followId }
            },
                { new: true }).then(data => res.json({ status: true, data }))
                .catch(err => {
                    console.log(err)
                    return res.status(422).json({ status: false, message: err })
                })
        })
}

exports.unfollowUser = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.currentUser._id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ status: false, message: err })
            }

            User.findByIdAndUpdate(req.currentUser._id, {
                $pull: { following: req.body.unfollowId }
            },
                { new: true }).then(data => res.json({ status: true, data }))
                .catch(err => {
                    return res.status(422).json({ status: false, message: err })
                })
        })
}

exports.updateProfilePic = (req, res) => {
    User.findByIdAndUpdate(req.currentUser._id, {
        $set: { profilePic: req.body.profilePic }
    }, { new: true })
        .then(data => res.status(200).json({ status: true, message: "Profile picture successfully updated.", data }))
        .catch(err => {
            console.log(err)
            return res.status(422).json({ status: false, message: "Error updating profile picture." })
        })
}

exports.updateName = (req, res) => {
    console.log(req.body.fullName)
    User.findByIdAndUpdate(req.currentUser._id, {
        $set: { fullName: req.body.fullName }
    }, { new: true })
        .then(data => res.status(200).json({ status: true, message: "Name successfully updated.", data }))
        .catch(err => {
            console.log(err)
            return res.status(422).json({ status: false, message: "Error updating name." })
        })
}

exports.searchUsers = (req, res) => {
    let userPattern = new RegExp(`^${req.body.query}`)
    User.find({ email: { $regex: userPattern } })
        .then(user => {
            res.json({ status: true, user })
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ status: false, message: 'Internal Server Error.' })
        })
}