// requiring things we require for app to run

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const posts = []
const lodash = require('lodash');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

// mongodb://localhost:27017
// connecting to mongodb
mongoose.connect('mongodb+srv://Tanmay:tanmay123@cluster0.ztdx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
// this will print errors if there are any.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're Connected to DB");
});

// creating a blog Schema for postss
const blogSchema = mongoose.Schema({
  title: String,
  post: String,
});

// creating a default Schema for default data
const defaultSchema = mongoose.Schema({
  home: String,
  about: String,
  contact: String
});

// making a collection through monogoose.
const Blog = mongoose.model('Blog', blogSchema);
const Default = mongoose.model('default', defaultSchema);

/*  Now for the app to work we'll have to first start mongod & create a blogDB & in that DB,
    create 2 collections namely defaults & blogs (additional 's' is because mongoose adds a 's'
    at the end of a collection that it makes i.e. making it in plural form )

    so in defaults add one document & same in blogs,

    after that run the app.
 */

// making app
const app = express();

// configuring ejs template language
app.set('view engine', 'ejs');

// configuring body-parser module to read data
app.use(bodyParser.urlencoded({
  extended: true
}));

/* only add this once
// adding default data
const post = new Blog({
  title: 'Clark Kent',
  post: 'Clark Kent Works at Daily Planet!',
});
post.save();

const def = new Default({
  home: 'Welcome To Daily Planet',
  about: 'A Simple Node-js App For Blog Website!',
  contact: 'Contact us at- tanmay12x3@yahoo.com'
})
def.save();
*/

// marking the public folder as static so that css/js files can be used.
app.use(express.static("public"));

//home route get request
app.get('/', function(req, res) {


  //fetching data from the collection we made.
  Default.findOne(function(err, content) {
    if (err) {
      console.log(err);
    }
//fetching data from the collection we made.
    Blog.find(function(err, blogs) {
      if (err) {
        console.log(err);
      }
      else{
        // case where no errors are found & data will be added into a JS object
        // so that we can pass it around in the ejs files
        res.render('home', {
          HomeContent: content.home,
          Posts: blogs
        });
      }
    });
  });
});

// get request for about section
app.get('/about', function(req, res) {
  //fetching data from the collection we made.
  Default.findOne(function(err, content) {
    if (!err) {
      res.render('about', {
        AboutContent: content.about
      });
    }
  });
});

// get request for the contact page
app.get('/contact', function(req, res) {
  Default.findOne(function(err, content) {
    if (!err) {
      res.render('contact', {
        ContactContent: content.contact
      });
    }
  });

});

// to get the compose page.
app.get('/compose', function(req, res) {
  res.render('compose');
});

// for handaling post requests from compose
app.post('/compose', function(req, res) {
  // getting data from html
  const BlogTitle = req.body.BlogTitle;
  const BlogPost = req.body.BlogPost;
  // making a js object so that we can save it in DB
  const post = new Blog({
    title: BlogTitle,
    post: BlogPost,
  });
  // saving into Database
  post.save();
  // redirecting to home page.
  res.redirect('/');
})

// for getting particular blog
app.get('/posts/:id', function(req, res) {
  const PostID = req.params.id;
  console.log(PostID);
  Blog.findOne({
    _id: PostID
  }, function(err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render('post', {
        Blog: blog
      });
    }
  });
});

// to listen on the domain
app.listen(port, function() {
  console.log("Server started!");
});
