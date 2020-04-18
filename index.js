require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('utility/jwt');
const errorHandler = require('utility/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth
app.use(jwt());

// api routes
app.use('/users', require('./users/controller'));
app.use('/messages', require('./messages/controller'));

app.get('/', function(req, res){
  res.json({
    message: "Welcome to the API, You connected."
    });
});

//handle errors
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
