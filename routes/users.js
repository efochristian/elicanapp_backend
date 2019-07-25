const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/users')


// POST route to register a user
router.post('/signup', userControllers.signup_user)


router.post('/login', userControllers.login_user)


router.delete('/:userId', userControllers.delete_user)



module.exports =

 router;
