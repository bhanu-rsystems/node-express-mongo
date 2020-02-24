const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodeExpressMongo');
let db = mongoose.connection;

//Check connection
db.once('open', () => {
    console.log('Application successfully connected with mongodb...');
});

//Check for DB error
db.on('error', err => {
    console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require('./models/article');

//Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser Middleware
//Parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({extended: false}));

//Parse application json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')))

//Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                title: 'Articles',
                articles:articles
            });
        }
    });
});

//Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

//Add new article by POST request
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save( err => {
        if(err){
            console.log(err);
            return;
        }else{
            console.log('New article added successfully.');
            res.redirect('/');
        }
    });
});

//Get single article
app.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(err){
            console.log(err);
        }else{
            res.render('article',{
                article: article
            });
        }
    });
});

//Edit article
app.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(err){
            console.log(err);
        }else{
            res.render('edit_article',{
                title: 'Edit Article',
                article: article
            });
        }
    });
});

//Update article by POST request
app.post('/articles/edit/:id', (req, res) => {
    let article ={};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id: req.params.id};

    Article.update(query, article, err => {
        if(err){
            console.log(err);
            return;
        }else{
            console.log('New article added successfully.');
            res.redirect('/');
        }
    });
});




//Start server
app.listen(3000, () => {
    console.log('Server running on port 3000...');
});