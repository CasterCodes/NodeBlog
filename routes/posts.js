const express = require("express")
const Router = express.Router()
const marked = require('marked')
const createDomPurify = require('dompurify')
const {JSDOM}  = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)
const postModel = require('../models/Posts')

// Addpost
Router.get('/addpost' , (req, res) => {
       res.render('addpost')
})
Router.get('/', async (req, res) => {
     const posts = await postModel.find().sort({createdOn:-1})
     res.render('index', {posts})
     
})
Router.post('/addpost', (req, res) => {
    
    // get user input from the request body
    const {author,title, body, markdown} = req.body
    // Initialize error valie
    let errors = []
    if(!author || !title || !body){
            errors.push({message:"Please fill in all the fields"})
            res.render('addpost', {errors, author, title})
    }else{
           const newPost = new postModel({
               author:author,
               title:title,
               body:body,
               
           })  
           newPost.save()
           .then(post => res.redirect(`/single/${post.slug}`))  
           .catch(error => console.log(error))
    }
   
})

// get a single post
Router.get("/single/:slug" ,(req, res) => {
       postModel.findOne({slug:req.params.slug})
       .then(post => res.render("singlepost", {post}))
       .catch(error => console.log(error))
})

// delete a post
Router.delete('/delete/:id', (req, res) => {
        postModel.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// edit
Router.get('/edit/:id', (req, res) => {
      postModel.findById(req.params.id)
      .then(post => {
             res.render('edit',{post})
      })
      .catch(() => res.redirect('/'))
})
// update
Router.put('/edit/:id', (req, res) => {
    postModel.update({_id: req.params.id}, {
        $set: {
            author:req.body.author,
            title:req.body.title,
            body:req.body.body,
            markdown:dompurify.sanitize(marked(req.body.body))


        }
    },
      {
            upsert:true
        }).then(() => res.redirect('/'))
})
module.exports = Router
