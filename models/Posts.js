const mongoose = require('mongoose')
const slugify  = require('slugify')
const marked = require('marked')
const createDomPurify = require('dompurify')
const {JSDOM}  = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)
const postSchema = new mongoose.Schema({
      author:{
          type:String,
          required:true
      },
      title:{
          type: String,
          required:true
      },
      body: {
           type: String,
           required:true
      }, 
      markdown : {
           type: String,
           required: true
      }, 
      createdOn: {
          type: Date,
          default: () => Date.now()
      },
      slug: {
           type: String,
           required:true,
           unique: true
      }

})
postSchema.pre('validate', function (next){
      if(this.title){
           this.slug = slugify(this.title, {lower:true, strict: true})  
      }

      if(this.body){
            this.markdown = dompurify.sanitize(marked(this.body)) 
      }
      next()
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post