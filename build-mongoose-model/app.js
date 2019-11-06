const moongoose = require('mongoose')
const dbUtils = require('../DatabaseInfo')

// get remote server url from DatabaseInfo.js
const reServer = dbUtils.getUrlWithUsernamePassword()

// connect to remote server
moongoose.connect(reServer)

// create a model with name is "Book" and attribute name which is String type
let Book = moongoose.model('Book', {
    name: String,
    published: Boolean,
    createdAt: Date,
    updatedAt: {type:Date, default: Date.now()}
})

// create a document 
let practicalNodeBook = new Book({
    name: 'Practical Node.js',
    author: 'Azat', // in Book model above, we didn't define 'author', so this author field will be omitted 
    link: 'https://google.com', // same as author, will be omitted when importing to database
    createdAt: Date.now()
})
console.log('Is new?', practicalNodeBook.isNew)

// save the document to Book collections (which is books in mongodb)
// auto bind to mongodb collection by lowercase all model name and add (s) -> Model: Book -> mongodb: books
// mongodb works based on object, not database, so we only to save object to the connected database
practicalNodeBook.save((error, results) => {
    if (error) {
        console.error(error)
        process.exit(1)
    } else {
        console.log('Saved: ', results)
        console.log('Is new?', practicalNodeBook.isNew)

        // find document by id and display 'name' only with 'findOne' method from mongoose
        // console.log(practicalNodeBook.id)
        Book.findOne({_id: practicalNodeBook.id}, 'name', (error, bookDoc) => {
            console.log(bookDoc.toJSON())
            console.log(bookDoc.id)
            // modify 'published' attribute
            bookDoc.published = true

            //  save bookDoc back to database after modifying its attribute
            // exit after saving bookDoc back to database
            bookDoc.save(process.exit)

        })
        // process.exit(0)
    }
})