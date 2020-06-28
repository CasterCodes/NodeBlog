const express = require('express')
const ExpressLayOuts = require('express-ejs-layouts')
const App = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
// db
db = "mongodb://localhost/blog"

// connect to mongo database
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true,useCreateIndex:true})
.then(() => console.log('Connected !'))
.catch(err => console.log(err))
// layout
App.use(ExpressLayOuts)
App.set('view engine', 'ejs')
App.use(methodOverride('_method'))
// body parser
App.use(express.urlencoded( { extended:false }))

// Posts middleware
App.use('/', require('./routes/posts'))

const PORT = process.env.PORT || 8080
App.listen(PORT, () => console.log(`Server running on port ${PORT}`))