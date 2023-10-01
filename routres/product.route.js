const router = require('express').Router();
const productModel = require('../models/product.model');
const jwt = require('jsonwebtoken');
const { application } = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../assets/images/'))
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g,"-") + file.originalname)
    }
})

const upload = multer({storage});
//**************ya3tini token lel user
var privateKey = process.env.PRIVATE_KEY

// verif token for user start here
verifToken = (req, res, next) => {
        let token = req.headers.authorization

        if (!token) {
            res.status(400).json({ msg: 'Access rejected  -_-' })
        }
        try { //al verif tetakedli min privateKey token w min expiresIn  token
            jwt.verify(token, privateKey)
            next()
        } catch (e) {
            res.status(400).json({ msg: e })
        }

    }
    //verif token for user end here

// verif token for admin start here
verifTokenAdmin = (req, res, next) => {
        let token = req.headers.authorization
        let role = req.headers.role
        if (!token || role != 'Admin') {
            res.status(400).json({ msg: 'Access rejected  -_-' })
        }
        try { //al verif tetakedli min privateKey token w min expiresIn  token
            jwt.verify(token, privateKey)
            next()
        } catch (e) {
            res.status(400).json({ msg: e })
        }

    }
    //verif token for admin end here


var secretKey = process.env.SECRET_KEY
var clientKey = process.env.CLIENT_KEY

verifSecretClient = (req, res, next) => {
    let sk = req.query.secret
    let ck = req.query.client

    if (sk == secretKey && ck == clientKey) {
        next()
    } else {
        res.status(400).json({ error: "Secret Key and Client Key -_-" })
    }
}

//**********
router.get('/', (req, res, next) => {
        productModel.testConnect().then((msg) => res.json(msg)).catch((err) => res.json(err))
    })
    //**********
router.post('/addproduct',upload.single('image'),(req, res, next) => {
    
    productModel.postNewProduct(req.file.filename,
            req.body.nameProduct, req.body.Description, req.body.priceProduct)
        .then((doc) =>{
           

            res.status(200).json(doc)
        }
        ).catch((err) => {
            res.status(400).json({ Error: err })
        })
    })

//**********i7awali a token al user b les informations mta3ou

router.get('/products', (req, res, next) => {
    productModel.getAllProducts()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => {
            res.status(400).json(err)
        })
})

//**********
router.get('/product/:id', (req, res, next) => {

    productModel.getOneProduct(req.params.id).then((doc) =>
            res.status(200).json(doc)

        ).catch((err) => {
            res.status(400).json(err)
        })

    })
    //**********
router.delete('/product/:id', verifTokenAdmin, verifSecretClient, (req, res, next) => {

    productModel.deleteOneProduct(req.params.id).then((doc) =>
        res.status(200).json(doc)

    ).catch((err) => {
        res.status(400).json(err)
    })

})


//**********
router.patch('/product/:id', verifTokenAdmin, verifSecretClient, (req, res, next) => {

    productModel.updateOneProduct(req.params.id,req.body.image ,
         req.body.nameProduct, req.body.Description,req.body.priceProduct)
        .then((doc) =>
            res.status(200).json(doc)

        ).catch((err) => {
            res.status(400).json(err)
        })

})


module.exports = router