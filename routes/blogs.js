var express = require('express');
var router = express.Router();
var mongodb = require('../model/mongo');

router.get('/', function (req, res) {
  if (req.session.user) { // ichechek nya yung session
    var params = {userid : req.session.user._id}; // i checheck lhat ng files na belong kay user._id
    mongodb.blogs.find(params, function (err, blog) {
      if (blog) {
        console.log('1 : Print the list of blog', blog);
        res.render("blog.jade", {fname: req.session.user.first_name, lname: req.session.user.last_name, list: blog });
      }
    });
  }
  else { // pag walang session ireredirect nya sa login
    res.redirect('/login');
  }
});

router.get('/new', function (req,res) {
  if (req.session.user) {
    res.render('createblog.jade');
  }
  else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res) { // creation of new blog

  var today = new Date();
  var mm = today.getMonth();
  var dd = today.getDate();
  var yyyy = today.getFullYear();
  if (dd<10) {
    dd = '0' + dd;
  }
  if (mm<10) {
    mm = '0' + mm;
  }
  var today = mm + '/' + dd + '/' + yyyy; 
  var time = new Date();
  var hour = time.getHours();
  var min = time.getMinutes();
  var sec = time.getSeconds();
  var time = hour + ':' + min + ':' + sec; 

  if (req.session.user) { 
      var params = {
        userid : req.session.user._id,
        title : req.body.titleblog,
        post : req.body.post,
        date : today,
        time : time
      };
      mongodb.blogs.insert(params, function (err, blog) {
        if (blog) {
          console.log('3.Successful na create ang new blog', blog);
          res.redirect('/blog');
        }
        else {
          res.render('createblog.jade', {createblogerror : "Creating blog error!"});
        }
      });
    }
  else {
    res.redirect('login');
  }
});
       
router.get('/:id', function (req, res) { //view specific blog
  if (req.session.user) {
    var params = {
      _id : req.params.id
    };
    mongodb.blogs.find(params, function (err, blog) {      
      if (blog) {
        console.log('4. Successful na nahanap yung blog na un na may same id sa inupdate', blog);
        res.render('viewblog.jade', {list: blog});      
      }
      else {
        res.render('blog.jade');
      }
    });
  }
  else {
    res.redirect('/login');
  }
});

router.get('/:id/edit', function (req, res) { //revise blog
  if (req.session.user) {
    var params = {
      _id : req.params.id
    };
    mongodb.blogs.find(params, function (err, blog) {
      if (blog) {
        console.log("5.Successful NA nahanap sa edit page");
        res.render('updateblog.jade', {list: blog});
      }
      else {
        res.render('viewblog.jade');
      }
    });
  }
  else {
    res.redirect('/login');
  }
});

router.post('/:id', function (req, res) { //re-view the blog with updates
  
  var today = new Date();
  var mm = today.getMonth();
  var dd = today.getDate();
  var yyyy = today.getFullYear();
  if (dd<10) {
    dd = '0' + dd;
  }
  if (mm<10) {
    mm = '0' + mm;
  }
  var today = mm + '/' + dd + '/' + yyyy; 
  var time = new Date();
  var hour = time.getHours();
  var min = time.getMinutes();
  var sec = time.getSeconds();
  var time = hour + ':' + min + ':' + sec; 
  var params = {
    _id : req.params.id
  }; 
  mongodb.blogs.find(params, function (err, blog) {
    if (blog) {
      var params1 = {
        userid : req.session.user._id,
        title : req.body.titleblog,
        post : req.body.post,
        date : today,
        time : time
      };
      mongodb.blogs.update({_id : req.params.id}, params1, function (err, blog) {
        if (blog) {
          console.log("2. successful na na update ang blog");
          console.log(blog)
          res.redirect('/blog/' + req.params.id);
        }
        else {
          res.render('updateblog.jade', {createblogerror : "Creating blog error!"});
        }
      });
    }
  });
});

router.get('/:id/delete', function (req, res) {  // remove blog
    var params = {
      _id : req.params.id
    };
    console.log(req.params.id);
    mongodb.blogs.find(params, function (err, blog) {
      mongodb.blogs.remove({_id : req.params.id}, function  (err, blog) {
        if (blog) {
          res.redirect('/blog');
        }
        else {
          res.redirect('/blog', {errordelete : 'Error in removing!'});
        }
      });
    });
});

module.exports = router;