const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        // unique: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    authGoogleId: {
        type: String
    },
    authFacebookId: {
        type: String
    },
    authType:{
        type: String,
        enum: ['local','google','facebook'],
        default: 'local'
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})



const User = mongoose.model('User', UserSchema)
module.exports = User