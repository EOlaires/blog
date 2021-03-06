var express = require('express');
var router = express.Router(); // ?? why capital R in Router
var mongodb = require('../model/mongo');



router.get('/', function (req, res) {
  if (req.session.user) {
    res.redirect('/blog');
  }
  else {
	  res.render('login.jade');
  }
});

router.post('/', function (req, res) {
  if (req.body.newuser) {
    if (!req.body.fname) {
      var fnval = "*";
    }
    if (!req.body.lname) {
      var lnval = "*";
    }
    if (!req.body.user) {
      var uval = "*";
    }
    if (!req.body.pass) {
      var pval = "*";
    }
    if (!req.body.pass1) {
      var p1val = "*"
    }

    if (req.body.fname !=0 && req.body.lname !=0 && req.body.user !=0 && req.body.user.pass !=0 && req.body.user.pass1 !=0) {
      if ((req.body.pass) === (req.body.pass1)) {
        var params = {
          first_name : req.body.fname,
          last_name : req.body.lname,
          username : req.body.user,
          password : req.body.pass
        };
          mongodb.users.insert(params, function (err, user) {
            if (err) {
              res.render('signup.jade', {signuperror : "SignUp not Successful!"});
            }
            else {
              
              var params = {
                username : req.body.user,
                password : req.body.pass
              }
              mongodb.users.find(params, function (err, user) {
                if (user) {
                  req.session.user = user;
                  console.log(req.session.user);
                  res.redirect('/blog');
                }
                else {
                  res.render('Blog.jade', {invalid : "Invalid username or password!"})
                }
              });
            }
          });
      }
      else {
        res.render('signup.jade', {message : "Mismatch Password!", fname : req.body.fname, lname :req.body.lname, user : req.body.user, notif : "!"});
      }     
    }
    else {
      res.render('signup.jade', {fnval:fnval, lnval:lnval, uval:uval, pval:pval, p1val: p1val, fname : req.body.fname, lname :req.body.lname, user : req.body.user});
    }
  }

  else {
    var params = {
      username : req.body.user,
      password : req.body.pass
    }
    mongodb.users.find(params, function (err, user) {
      if (user) {
        req.session.user = user;
        console.log(req.session.user);
        res.redirect('/blog');
      }
      else {
        res.render('login.jade', {invalid : "Invalid username or password!"})
      }
    });
  }
});

module.exports = router; // ?? what is module.exports clarification