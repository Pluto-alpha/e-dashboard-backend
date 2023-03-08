const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory!"]
    },
    email: {
        type: String,
        required: [true, "email is mandatory!"]
    },
    password: {
        type: String,
        required: [true, "password is mandatory!"]
    },

}, {
    timestamps: true,
})

module.exports = mongoose.model('User', UserSchema);