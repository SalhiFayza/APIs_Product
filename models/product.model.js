const mongoose = require('mongoose')
const Joi = require('joi')
require('dotenv').config()
const schemaValidation = Joi.object({
    image: Joi.string().required(),
    nameProduct: Joi.string().min(3).max(20).required(),
    Description: Joi.string().min(3).max(400).required(),
    priceProduct: Joi.number().required()
})

//******
let schemaProduct = mongoose.Schema({
    image: String,
    nameProduct: String,
    Description: String,
    priceProduct: Number
})


//**********
var Product = mongoose.model('product', schemaProduct)
var url = process.env.URL

//**********
exports.testConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            mongoose.disconnect()
            resolve('OK Connected')
        }).catch((err) => {
            reject(err)
        })
    })
}

//**********
exports.postNewProduct = (image, nameProduct, Description, priceProduct) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            let validation = schemaValidation.validate({ image:image ,nameProduct: nameProduct, 
                Description: Description,priceProduct: priceProduct})
            if (validation.error) {
                mongoose.disconnect()
                reject(validation.error.details[0].message)

            }
            let product = new Product({
                image: image,
                nameProduct: nameProduct,
                Description: Description,
                priceProduct: priceProduct,
            })
            product.save().then((doc) => {
                mongoose.disconnect()
                resolve(doc)
            }).catch((err) => {
                mongoose.disconnect()
                reject(err)
            })

        }).catch((err) => { reject(err) })


    })
}

//**********
exports.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Product.find()
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}


//**********
exports.getOneProduct = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Product.findById(id)
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

//**********
exports.deleteOneProduct = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Product.deleteOne({ _id: id })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}


//**********
exports.updateOneProduct= (id, image,nameProduct, Description, priceProduct) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            let validation = schemaValidation.validate({  image:image ,nameProduct: nameProduct,
                Description: Description,priceProduct: priceProduct })
            if (validation.error) {
                mongoose.disconnect()
                reject(validation.error.details[0].message)
            }
            return Product.updateOne({ _id: id }, {image:image, nameProduct: nameProduct,  
                Description: Description, priceProduct: priceProduct })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}