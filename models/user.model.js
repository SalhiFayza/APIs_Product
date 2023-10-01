const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
let schemaUser = mongoose.Schema({
    image:String,
    userName: String,
    email: String,
    password: String
})

let url = process.env.URL
var User = mongoose.model('users', schemaUser)


exports.register = (userName, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOne({ email: email })
        }).then((doc) => {
            if (doc) {
                mongoose.disconnect()
                reject('This user is exist in database')
            } else {
                bcrypt.hash(password, 10).then((hashPassword) => {
                    let user = new User({
                        userName: userName,
                        email: email,
                        password: hashPassword
                    })
                    user.save().then((user) => {
                        mongoose.disconnect()
                        resolve(user)
                    }).catch((err) => {
                        mongoose.disconnect()
                        reject(err)
                    })

                }).catch((err) => {
                    mongoose.disconnect()
                    reject(err)
                })
            }
        })
    })
}



var privateKey = process.env.PRIVATE_KEY

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOne({ email: email })
        }).then((user) => {
            if (!user) {
                mongoose.disconnect()
                reject("This email is not exist in database")
            } else {
                bcrypt.compare(password, user.password).then((same) => {
                    if (same) {
                        //send token
                        let token = jwt.sign({
                            id: user._id,
                            userName: user.userName
                        }, privateKey, { expiresIn: '1h' })
                        mongoose.disconnect()
                        resolve(token)
                    } else {
                        mongoose.disconnect()
                        reject('Invalid email or password')
                    }
                }).catch((err) => {
                    mongoose.disconnect()
                    reject(err)
                })
            }
        })
    })
}
//**********
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.find()
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
exports.getRegisterUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findById(id)
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
exports.deleteOneUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.deleteOne({ _id: id })
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
exports.updateOneUser= (id,image,userName, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            let validation = schemaValidation.validate({  image:image ,userName: userName,
                email: email,password: password })
            if (validation.error) {
                mongoose.disconnect()
                reject(validation.error.details[0].message)
            }
            return User.updateOne({ _id: id }, {image:image, userName: userName,  
                email: email,password: password  })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}