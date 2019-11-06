const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(require('../DatabaseInfo').getUrlWithUsernamePassword(), { useNewUrlParser: true, useUnifiedTopology: true })

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')

let app = express()
app.use(bodyParser.json())
app.use(logger('dev'))

const Account = mongoose.model('edx-mongoose-accounts', {
    name: String,
    balance: Number
})

app.get('/accounts', (req, res, next) => {
    Account.find({}, null, {sort: {_id: -1}}, (error, accounts) => {
        if (error) return next(error)
        res.send(accounts)
    })
})

app.post('/accounts', (req, res, next) => {
    let newAccount = new Account(req.body)
    newAccount.save((error, results) => {
        if (error) return next(error)
        res.send(results)
    })
})

// new way to create a middleware -> to check all the route contains id as request param
// we don't want to check the same thing for many routes
app.param('id', (req, res, next) => {
    // if we can find the account by id, then we just need to pass this account to the further endpoints 
    Account.findById(req.params.id, (error, account) => {
        req.account = account
        next()
    })
})

app.get('/accounts/:id', (req, res, next) => {
    // we can retrieve account by req.account because we implement the app.param as middleware and embed account to req
    res.send(req.account.toJSON())
})

app.put('/accounts/:id', (req, res, next) => {
    let account = req.account
    if(req.body.name) account.name = req.body.name
    if(req.body.balance) account.balance = req.body.balance
    account.save((error, results) => {
        if (error) next(error)
        res.send(results)
    })
})

app.delete('/accounts/:id', (req, res, next) => {
    req.account.remove((error, results) => {
        if (error) next(error)
        res.send(results)
    })
})

app.use(errorHandler())

app.listen(3000)


