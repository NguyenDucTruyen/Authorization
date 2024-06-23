const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()
const UserController = require('../controllers/user')
const { auth,validateBody, validateParam, schemas } = require('../helpers/routerHelpers')
const passport = require('passport')
require('../middleware/passport')

router.route('/')
	.get(UserController.index)
	.post(validateBody(schemas.userSchema), UserController.newUser)

router.post('/auth/google', passport.authenticate('google-plus-token', { session: false }), UserController.authGoogle);

router.post('/signup', validateBody(schemas.signUpSchema), UserController.signUp)
router.post('/signin', validateBody(schemas.signInSchema), UserController.signIn)
router.get('/secret', [passport.authenticate('jwt', { session: false }),auth()], UserController.secret)
router.route('/:userID')
	.get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
	.put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
	.patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/:userID/decks')
	.get(validateParam(schemas.idSchema, 'userID'), UserController.getUserDecks)
	.post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), UserController.newUserDeck)

module.exports = router