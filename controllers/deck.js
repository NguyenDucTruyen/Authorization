const Deck = require('../models/Deck')
const User = require('../models/User')

const deleteDeck = async (req, res, next) => {
    const { deckID } = req.value.params

    // Get a deck
    const deck = await Deck.findById(deckID)
    const ownerID = deck.owner

    // Get a owner
    const owner = await User.findById(ownerID)

    // Remove the deck
    await deck.remove()

    // Remove deck from owner's decks list
    owner.decks.pull(deck)
    await owner.save()

    return res.status(200).json({ success: true })
}

const getDeck = async (req, res, next) => {
    const deck = await Deck.findById(req.value.params.deckID)

    return res.status(200).json({ deck })
}

const index = async (req, res, next) => {
    const decks = await Deck.find({})

    return res.status(200).json({ decks })
}

const newDeck = async (req, res, next) => {
    // Find owner
    const owner = await User.findById(req.value.body.owner)

    // Create a new deck
    const deck = req.value.body
    delete deck.owner

    deck.owner = owner._id
    const newDeck = new Deck(deck)
    await newDeck.save()

    // Add newly created deck to the actual decks
    owner.decks.push(newDeck._id)
    await owner.save()

    return res.status(201).json({ deck: newDeck })
}

const replaceDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    // Check if put user, remove deck in user's model
    if (newDeck.owner !== result.owner) {
        const oldOwner = await User.findById(result.owner)
        oldOwner.decks.pull(result)
        await oldOwner.save()

        const newOwner = await User.findById(newDeck.owner)
        newOwner.decks.push(result)
        await newOwner.save()
    }
    return res.status(200).json({
        message: 'Deck updated',
        data: newDeck
    })
}

const updateDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    // Check if put user, remove deck in user's model
    if (newDeck.owner && newDeck.owner !== result.owner) {
        const oldOwner = await User.findById(result.owner)
        oldOwner.decks.pull(result)
        await oldOwner.save()

        const newOwner = await User.findById(newDeck.owner)
        newOwner.decks.push(result)
        await newOwner.save()
    }
    return res.status(200).json({
        message: 'Deck updated',
        data: newDeck
    })
}

module.exports = {
    deleteDeck,
    getDeck,
    index,
    newDeck,
    replaceDeck,
    updateDeck
}