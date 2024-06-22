const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
require('dotenv').config()
const User = require('../models/User')

passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.SECRET_KEY
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub)
        return done(null, user)
    } catch (error) {
        done(error, false)
    }
})
)
