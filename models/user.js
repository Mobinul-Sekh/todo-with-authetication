const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// userSchema.pre('save', (next) => {
//     console.log('performing actions before save...');
//     next();
// })

const User = mongoose.model('User', userSchema)

module.exports = User