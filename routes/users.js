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
    if (req.body.fname.length !=0 && req.body.lname !=0 && req.body.user !=0 && req.body.user.pass !=0 && req.body.user.pass1 !=0) {
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
        res.render('signup.jade', {message : "Mismatch Password!"});
      }     
    }
    else {
      res.render('signup.jade', {signuperror : "Please sign all the required fields!"});
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

// router.get('/signup', function (req, res) {
//   res.render('signup.jade');
// });

// router.post('/signup', function (req, res) {

//   if (req.body.fname.length !=0 && req.body.lname !=0 && req.body.user !=0 && req.body.user.pass !=0 && req.body.user.pass1 !=0) {
//     //console.log(req.body);
//       if ((req.body.pass) === (req.body.pass1)) {
//         var params = {
//           first_name : req.body.fname,
//           last_name : req.body.lname,
//           username : req.body.user,
//           password : req.body.pass
//         }
//       }
//       else {
//         res.render('signup.jade', {message : "Mismatch Password!"});
//       }

//       mongodb.users.insert(params, function (err, user) {
//         if (err) {
//           res.render('signup.jade', {signuperror : "SignUp not Successful!"});
//         }
//         else {
//           res.redirect('/login');
//         }
//       })
//   }
//   else {
//     res.render('signup.jade', {signuperror : "Please sign all the required fields!"});
//   }

// });

module.exports = router; // ?? what is module.exports clarification