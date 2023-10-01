const adminModel = require('../models/admin.model')

const router = require('express').Router()


router.post('/register', (req, res, next) => {
    adminModel.register(req.body.userName, req.body.email, req.body.password).then((user) => {
        res.status(200).json({ user: user, Message: 'Ok Added !' })
    }).catch((err) => {
        res.status(400).json({ Error: err })
    })
})

router.post('/login', (req, res, next) => {
    adminModel.login(req.body.email, req.body.password).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json({ Error: err })
    })
})

module.exports = router