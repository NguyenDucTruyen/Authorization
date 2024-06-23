const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
require('dotenv').config()
const User = require('../models/User')

// Passsport JWT
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

// Passport Google
passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, next) => {
    try {
        console.log("access token:", accessToken)
        console.log("refresh token:", refreshToken)
        console.log("profile:", profile)
        
    } catch (error) {
        done(error, false)
    }
})
)