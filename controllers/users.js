const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.signup_user = (req, res, next) => {

	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				// status 409 - conflict result
				// status 422 - unprocessable result

				return res.status(409).json({
					message: 'Email already exist'
				})
			} else {
					bcrypt.hash(req.body.password, 10, (err, hash) => {
						if (err) {
							return res.status(500).json({
								error: err
							})
						} else {
							const user = new User({
								_id: new mongoose.Types.ObjectId(),
								firstname: req.body.firstname,
								lastname: req.body.lastname,
								email: req.body.email,
								password: hash
							});
							user.save()
								.then(result => {
									res.status(200).json({
										message: 'User Created'
									})
								})
								.catch(err => {
									res.status(500).json({
										error: err
									})
								})
						}
					})
			}

		})

}


exports.login_user = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1 ) {
				// status 401 unauthorize
				return res.status(401).json({
					message : 'Auth failed - Email no posted'
				}); 
			
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    			// res == false

    			if (result) {
    				const token = jwt.sign({
    					email : user[0].email,
    					userId : user[0]._id
    				}, process.env.JWT_KEY || 'secrete',
    					{
    						expiresIn: '1h',
						},
    				 )
    				return res.status(200).json({
    					message : 'Login Successful!', 
						token : token,
						id: user[0].id,
						firstname: user[0].firstname,
						lastname: user[0].lastname,
						email: user[0].email,
						joined: user[0].joined
    				});
    			} else {
    				return res.status(401).json({
    					message : 'Auth failed'
    				});
    			}

			});
		})
		.catch(err => {

			res.status(500).json({
				error : err
			})
		})
}

exports.delete_user = (req, res, next) => {
	User.deleteOne({ _id : req. params.userId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'User deleted'
			})
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		})
}

