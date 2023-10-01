const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
let schemaUser = mongoose.Schema({
    userName: String,
    email: String,
    password: String
})

let url = process.env.URL
var Admin = mongoose.model('admin', schemaUser)


exports.register = (userName, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Admin.findOne({ email: email })
        }).then((doc) => {
            if (doc) {
                mongoose.disconnect()
                reject('This user is exist in database')
            } else {
                bcrypt.hash(password, 10).then((hashPassword) => {
                    let user = new Admin({
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
            return Admin.findOne({ email: email })
        }).then((user) => {
            if (!user) {
                mongoose.disconnect()
                reject("Invalid email or password -_-")
            } else {
                bcrypt.compare(password, user.password).then((same) => {
                    if (same) {
                        //send token
                        let token = jwt.sign({
                            id: user._id,
                            userName: user.userName,
                            email: user.email,
                            role: 'Admin'
                        }, privateKey, { expiresIn: '1h' })
                        mongoose.disconnect()
                        resolve({ token: token, role: 'Admin', userName: user.userName })
                    } else {
                        mongoose.disconnect()
                        reject('Invalid email or password -_-')
                    }
                }).catch((err) => {
                    mongoose.disconnect()
                    reject(err)
                })
            }
        })
    })
}