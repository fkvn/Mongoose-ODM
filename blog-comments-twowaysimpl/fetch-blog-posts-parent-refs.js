var mongoose = require('mongoose')

// configure Promise implementation to use default ES6 Promise
mongoose.Promise = global.Promise

// connect to remote server
mongoose.connect(require('../DatabaseInfo').getUrlWithUsernamePassword(), { useNewUrlParser: true })

/***** Parent ref approach *****
 * In this approach, the children have parent refs -> each comment willhave a reference to post
 * ->we still have: 1 collection (Posts) and 1 collection (Comments)
 * each comment will have 1 attribute called 'post' to reference to its post document in Post collection
 * 
 * Using Mongoose's populate() method to fetch comments in a post query.
 * Instead of using 2 queries: find comment and find post -> using populate() we only need 1 single query on 'comment'
*/

// create Post model (collection)
const Post = mongoose.model('edx-Post', {
    name: String,
    url: String,
    text: String,
})

// create Comment model (collection)
const Comment = mongoose.model('edx-Comment', {
    text: String,
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'edx-Post'}
})

// create a sample post document for Post collection
var post = new Post({
    name: 'post 1',
    url: 'https://fkvn/post1',
    text: 'post 1 description',
})

// save post to database
post.save((error) => {
    if (error) console.error(error)
    else console.log('The post is saved: ', post.toJSON())
    
    // we save comment here because we need post._id for each comment, we can't save comment before post
    let i = 0

    let commentList = [
        {text: 'comment1'},
        {text: 'comment2'},
        {text: 'comment3'},
        {text: 'comment4'},
        {text: 'comment5'}
    ].forEach((comment, index, list) => {
        comment.post = post._id
        const c = new Comment(comment)
        c.save((error, result) => {
            if (error) console.error(error)
            // if i == list.length -> we complete add all comments to database, then we can extract data to see how it works
            if (++i === list.length)
                queryCommentWithPost()
        })
    })
})

const queryCommentWithPost = () => {
    // populate 'post' attribute in Comment 'comment 1'
    Comment
        .findOne({text: 'comment1'})
        .populate('post')
        .exec((error, comment) => {
            if (error) console.log(error)
            console.log(`The comment is ${comment}`)
            mongoose.disconnect()
        })
}

