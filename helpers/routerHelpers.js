const Joi = require('@hapi/joi')

const auth = (...role) => {
    return async (req, res, next) => {
        if (req.user === 'expired') return res.status(401).json({
            error: {
                message: 'Token exprired'
            }
        })
        if (!req.value) req.value = {}
        if (!req.value.user) req.value.user = {}
        req.value.user = req.user

        next()
    }
}

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)

        if (validatorResult.error) {
            return res.status(400).json({
                "status": "failure",
                "error": {
                    "message": validatorResult.error.details[0].message
                }
            })
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}

            req.value.body = validatorResult.value
            next()
        }
    }
}

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({ param: req.params[name] })

        if (validatorResult.error) {
            return res.status(400).json({
                "status": "failure",
                "error": {
                    "message": validatorResult.error.details[0].message
                }
            })
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}

            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const schemas = {
    deckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required()
    }),

    deckOptionalSchema: Joi.object().keys({
        name: Joi.string().min(6),
        description: Joi.string().min(10),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }),

    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    newDeckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    signInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    signUpSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    }),

    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required()
    }),

    userOptionalSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email()
    })
}

module.exports = {
    auth,
    validateBody,
    validateParam,
    schemas
}