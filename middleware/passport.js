const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
require('dotenv').config()
const User = require('../models/User')
const { error } = require('@hapi/joi/lib/base')

// Passsport JWT
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.SECRET_KEY
}, async (payload, done) => {
    try {
        const exp = new Date(payload.exp)
        if (new Date() > exp) {
            console.log(exp)
            return done(null, 'expired')
        }
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
        const userExist = await User.findOne({ authGoogleId: profile.id, authType: 'google' })
        if (!userExist) {
            const newUser = User({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                authType: 'google',
                authGoogleId: profile.id
            })
            console.log('create new user')
            await newUser.save()
            return next(null, userExist._id)
        }
        return next(null, userExist._id)

    } catch (error) {
        next(error, false)
    }
})
)