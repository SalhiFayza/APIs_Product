const routeModel = require('../models/user.model')

const router = require('express').Router()


router.post('/register', (req, res, next) => {
    routeModel.register(req.body.userName, req.body.email, req.body.password).then((user) => {
        res.status(200).json({ user: user, Message: 'Ok User Added !' })
    }).catch((err) => {
        res.status(400).json({ Error: err })
    })
})

router.post('/login', (req, res, next) => {
    routeModel.login(req.body.email, req.body.password).then((token) => {
        res.status(200).json({ token: token })
    }).catch((err) => {
        res.status(400).json({ Error: err })
    })
})

router.get('/users', (req, res, next) => {
    routeModel.getAllUsers(req.body.userName, req.body.email)
        .then((doc) => res.status(200).json(doc)
       )
        .catch((err) => {
            res.status(400).json(err)
        })
})



//**********
router.get('/user/:id', (req, res, next) => {

    routeModel.getRegisterUser(req.params.id).then((doc) =>
            res.status(200).json(doc)

        ).catch((err) => {
            res.status(400).json(err)
        })

    })
    //**********
router.delete('/user/:id', (req, res, next) => {

    routeModel.deleteOneUser(req.params.id).then((doc) =>
        res.status(200).json(doc)

    ).catch((err) => {
        res.status(400).json(err)
    })

})


//**********
router.patch('/user/:id',  (req, res, next) => {

    routeModel.updateOneUser(req.params.id,req.body.image ,
         req.body.userName, req.body.email,req.body.password)
        .then((doc) =>
            res.status(200).json(doc)

        ).catch((err) => {
            res.status(400).json(err)
        })

})

module.exports = router