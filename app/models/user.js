let mongoose = require('mongoose')
let Schema = mongoose.Schema
let mongooseUniqueValidator = require('mongoose-unique-validator')

let userSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    reset_token: String,
    reset_token_expire: Date
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password
      delete reset_token
      delete reset_token_expire
    }
  }
})

userSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('User', userSchema)
