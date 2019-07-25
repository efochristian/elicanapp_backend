const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {

	const token = req.headers.authorization.split(' ')[1];

	jwt.verify(token, 'secrete', (err, decoded) => {

  		// err
  		// decoded undefined

  		if (err) {
  			res.status(500).json({
  				message : 'Auth failed. frm jwt'	
  			})
  		}
  		else {
  			req.userData = decoded,
  			next();
  		}


	});



}

module.exports = checkAuth;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtYUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDAyYjg5YTVhMTRjODE1ZDJhYjRlMjEiLCJpYXQiOjE1NjA1NDk2MjAsImV4cCI6MTU2MDU1MzIyMH0.hRMkkkS0tayc0dOYGaYQgZWTsWBl9kZy_KzGqwko7UE