const mongoose = require('mongoose')
const validator = require('validator')

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email address is required.'],
      validate: [validator.isEmail, 'Please provide a valid email address.']
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required.'],
      maxlength: 128,
      minlength: 6,
      select: false
    },
    profilePic: {
      type: String,
      default: 'https://res.cloudinary.com/saman5/image/upload/v1616567687/noimage_wpwal4.jpg'
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    pwdResetToken: {
      type: String
    },
    linkExpireTime: {
      type: Date
    }
  },
  schemaOptions
)

const User = mongoose.model('User', userSchema)

module.exports = User
