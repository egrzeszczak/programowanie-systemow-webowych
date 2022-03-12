const Mongoose = require('mongoose')

const UserSchema = new Mongoose.Schema({
    email: String,
    password: String,
    access: Number,
})

module.exports = Mongoose.model('User', UserSchema)