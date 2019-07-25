const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Vote', {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

