const Deck = require('../models/Deck')
const Dotenv = require('dotenv')
Dotenv.config()
const User = require('../models/User')
const jwt = require('jsonwebtoken');


const encode = (UserID) => {
    return jwt.sign({
        iss: 'Truyen Duc',
        sub: UserID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.SECRET_KEY)
}

const getUser = async (req, res, next) => {
    const { userID } = req.value.params

    const user = await User.findById(userID)

    return res.status(200).json({ user })
}

const getUserDecks = async (req, res, next) => {
    const { userID } = req.value.params

    // Get user
    const user = await User.findById(userID).populate('decks')

    return res.status(200).json({ decks: user.decks })
}

const index = async (req, res, next) => {
    const users = await User.find({})

    return res.status(200).json({ users })
}

const newUser = async (req, res, next) => {
    const newUser = new User(req.value.body)

    await newUser.save()

    return res.status(201).json({ user: newUser })
}

const newUserDeck = async (req, res, next) => {
    const { userID } = req.value.params

    // Create a new deck
    const newDeck = new Deck(req.value.body)

    // Get user
    const user = await User.findById(userID)

    // Assign user as a deck's owner
    newDeck.owner = user

    // Save the deck
    await newDeck.save()

    // Add deck to user's decks array 'decks'
    user.decks.push(newDeck._id)

    // Save the user
    await user.save()

    res.status(201).json({ deck: newDeck })
}

const replaceUser = async (req, res, next) => {
    // enforce new user to old user
    const { userID } = req.value.params

    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID, newUser)

    return res.status(200).json({ success: true })
}

const signIn = async (req, res, next) => {
    const { email, password } = req.value.body
}
const signUp = async (req, res, next) => {
    const { email, firstName, lastName, password } = req.value.body
    const foundUser = await User.findOne({ email })
    if (foundUser) {
        return res.status(403).json({
            error: {
                message: 'Email already exist'
            }
        })
    }
    const newUser = new User({ email, firstName, lastName, password })
    await newUser.save()
    const token = encode(newUser._id)
    return res.status(201).json({ message: 'success', token })
}

const secret = async (req, res, next) => {
    return res.status(200).json({
        message: 'Valid Token',
        user: req.user
    })
}

const updateUser = async (req, res, next) => {
    // number of fields
    const { userID } = req.value.params

    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID, newUser)

    return res.status(200).json({ success: true })
}

module.exports = {
    getUser,
    getUserDecks,
    index,
    newUser,
    newUserDeck,
    replaceUser,
    updateUser,
    signIn,
    signUp,
    secret
}