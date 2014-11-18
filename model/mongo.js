var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbBlog');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name : String,
	last_name : String,
	username : String,
	password : String
});

var Users = mongoose.model('Users', UserSchema);

module.exports.users = {
	insert : function (params, done) {
		Users.create(params, function (err, result) {
			if (err) {
				return done(err);
			}
			else {
				return done(null, result);
			}
		});
	},
  find : function (params, done) {
    Users.findOne(params, function (err, result) {
      if (err) {
        return done(err);
      }
      else {
        return done(null, result);
      }
    });
  }
}

var BlogSchema = new Schema({ 
  userid: String,
  title : String,
  post : String,
  date : String,
  time : String
});

var Blogs = mongoose.model('Blogs', BlogSchema);

module.exports.blogs = {
  insert : function (params, done) {
    Blogs.create(params, function (err, result) {
      if (err) {
        return done(err);
      }
      else {
        return done(null, result);
      }
    });
  },
  find : function (params, done) {
    Blogs.find(params, function (err, result) {
      if (err) {
        return done(err);
      }
      else {
        return done(null, result);
      }
    });
  },
  update : function (condition, params, done) {
    Blogs.update(condition, params, function (err, result) {
      if (err) {
        return done(err)
      }
      else {
        return done (null, result);
      }
    })
  },
  remove : function (condition, done) {
    Blogs.remove(condition, function (err, result) {
      if (err) {
        return done(err)
      }
      else {
        return done (null, result);
      }
    })
  }
}