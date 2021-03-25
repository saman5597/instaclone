const mongoose = require('mongoose')

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required.']
    },
    body: {
      type: String,
      required: [true, 'Post body is required.']
    },
    imageUrl: {
      type: String,
      required: [true, 'Post image is required.']
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        text: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      }
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  schemaOptions
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
