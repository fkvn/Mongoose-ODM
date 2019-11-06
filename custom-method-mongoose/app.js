const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const dbUtils = require('../DatabaseInfo')

// get remote server url from DatabaseInfo.js
const reServer = dbUtils.getUrlWithUsernamePassword()

// connect to remote server
mongoose.connect(reServer)

// create a schema
const bookSchema = mongoose.Schema({name: String})

// method for an individual document = instance method
// we define those methods because we will need it for a lot of time 
bookSchema.method({
    // define 'buy' function
    buy(quantity, customer, callback) {
        var bookToPurchase = this
        console.log('buy')
        return callback()
    },
    // define 'refund' function
    refund(customer, callback) {
        // process the refund
        console.log('refund')
        return callback()
    }
})

// static method for the entire documents
bookSchema.static( {
    getZeroInventoryReport(callback) {
        console.log('getZeroInventoryReport')
        let books = []
        return callback(books)
    },
    // pass bookId to see how many book we have
    getCountOfBooksById(bookId, callback) {
        console.log('getCountOfBooksById')
        let count = 0
        return callback(count)
    }
})

// create a model from a given schema
let book = mongoose.model('Book', bookSchema)

book.getZeroInventoryReport(() => {})
book.getCountOfBooksById(123, () => {})

let practicalNodeBook = new book({name: 'Practical Node.js, 3nd Edition'})

practicalNodeBook.buy(1, 2, () => {})
practicalNodeBook.refund(1, () => {})

bookSchema.post('save', (next) => { 
    // prepare for saving
    console.log('post save')
    return next()
})

bookSchema.pre('remove', (next) => {
    // prepare for removing
    console.log('pre remove')
    return next()
})

practicalNodeBook.save((error, results) => {
    if (error) {
        console.error(error)
        process.exit(1)
    } else {
        console.log('Saved: ', results)
        // remove it here, we just need to see how it works.
        // if you want to import it to database, then comment those below lines
        practicalNodeBook.remove((error, results) => {
            if (error) {
                console.error(error)
                process.exit(1)
            }
            else {
                process.exit(0)
            }
        })
    }
})