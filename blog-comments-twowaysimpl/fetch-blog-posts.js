var mongoose = require('mongoose')

// configure Promise implementation to use default ES6 Promise
mongoose.Promise = global.Promise

// connect to remote server
mongoose.connect(require('../DatabaseInfo').getUrlWithUsernamePassword(), { useNewUrlParser: true })

/***** Child ref approach *****
 * In this approach, we store references (Object IDs) to comments in a post collection 
 * -> 1 collection (Posts) and 1 collection (Comments)
 * Instead of storing the whole document (comment), we only store comment's id to 'post' document
 * 
 * Using Mongoose's populate() method to fetch comments in a post query.
 * Instead of using 2 queries: find post and find comment -> using populate() we only need 1 single query on 'post'
*/

// create Post model (collection)
const Post = mongoose.model('edx-Post', {
    name: String,
    url: String,
    text: String,
    // this line says that we will store Object Id instead of the whole object, and this id will refer to 'Comment' document
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'edx-Comment'}]
})

// create Comment model (collection)
const Comment = mongoose.model('edx-Comment', {
    text: String
})

// create a sample of list of comments
// map the sample of list comments to Comment collection
let commentList = [
    {text: 'comment1'},
    {text: 'comment2'},
    {text: 'comment3'},
    {text: 'comment4'},
    {text: 'comment5'}
].map((comment) => {
    // each comment will be created and stored as the newly comment document in Comment collection
    const c = new Comment(comment)
    c.save()
    return c._id
})

console.log(commentList)

// create a sample post document for Post collection
var post = new Post({
    name: 'post 1',
    url: 'https://fkvn/post1',
    text: 'post 1 description',
    // commentList here is an array with comment IDs from Comment collection
    comments: commentList

})

// after done with creating all data, we shall save post to database
post.save((error) => {
    if (error) console.error(error)
    else console.log('The post is saved: ', post.toJSON())
    
    // Now, we populate the comments from 'post 1'
    Post
        .findOne({name: 'post 1'})
        .populate('comments')
        // return post if populate action is successful 
        .exec((error, post) => {
            if (error) return console.error(error)
            console.log(`The post is ${post}`)
            mongoose.disconnect()
        })
})

