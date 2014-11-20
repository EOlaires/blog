var express = require('express'); 
var app = express(); // instantiate of new express
var path = require('path');

app.engine('jade', require('jade').__express); //jade //automatic n nagrurun ung jade kinocompile sya s node express pra marun

app.use(express.static(path.join(__dirname, 'public'))); // include css and js files in node

var mongodb = require('./model/mongo'); //mongo
var session = require('express-session');  //session
var cookieParser = require('cookie-parser');  //cookieparser
app.use(cookieParser());
app.use(session({secret:'anbu', saveUninitialized:true, resave:true}));

var bodyParser = require('body-Parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/signup', function (req, res) {
  res.render('signup.jade');
});

app.use('/blog', require('./routes/blogs'));

app.use('/login', require('./routes/users'));


app.listen(8080);
console.log("Listening on port localhost:8080");