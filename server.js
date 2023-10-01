const express = require('express')
const productRoute = require('./routres/product.route')
const userRoute = require('./routres/user.route')
const adminRoute = require('./routres/admin.route')
const path = require('path')
const app = express()
//**************
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'assets/images')))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader("Access-Control-Request-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    res.setHeader('Access-Control-Allow-Headers', "*");
    res.setHeader('Access-Control-Allow-Methods', "*");
    next()
})
//****
app.use('/images', express.static('assets/images'));
//*******************
app.use('/', productRoute)
    //*******************
app.use('/', userRoute)
    //*******************
app.use('/admin', adminRoute)
    //*********************
app.listen(3080, () => console.log('server running in port 3080'))