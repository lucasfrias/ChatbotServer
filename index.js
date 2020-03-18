var express    = require('express');      
var app        = express();                 
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send("Welcome to CS 4800 Server!")
  });

var router = express.Router();             

// middleware
router.use(function(req, res, next) {
  // need authentication for requests
  console.log('Middleware!');
  next();
});

//GET request using url, http://localhost:8080/api/message
router.route('/message')
    .get(function(req, res) {
        res.json({ newMessage: 'Your message has been recieved by server! ' +
        'Message sent = ' + req.body.message,
      statusCode: 200});
        
    });

//register routes
app.use('/api', router);

//start server
app.listen(process.env.PORT, '0.0.0.0', function(err) {
  console.log("Started listening on %s", app.url);
});