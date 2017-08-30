const express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const app = express();

//generate tokens
function generateToken(user) {
  var u = {
   name: user.name,
  };
  return token = jwt.sign(u, process.env.JWT_SECRET, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post('/signup', function(req,res){
	var user = {
		name: req.body.user
	};
	var token = generateToken(user); //<----- Generate Token
	console.log(token);
    res.json({
       user: user,     //<----- Return both user and token
       token: token
    });
})


app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  console.log('in');
  console.log(req.headers);
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');

  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Please register Log in using a valid email to submit posts'
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

app.post('/corefunctions', function(req,res){
	console.log(req.user); 
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})
