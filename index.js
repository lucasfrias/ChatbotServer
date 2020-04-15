var express    = require('express');      
var app        = express();                 
var bodyParser = require('body-parser');
var natural    = require('natural');
var Request    = require("request");
const { v4: uuidv4 } = require('uuid');

//create jwt
var jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.json({
      message: "Welcome to the API, You connected."
      });
  });

//set port
const port = process.env.PORT || 3000;

var router = express.Router();             

// middleware
router.use(function(req, res, next) {
  // need authentication for requests
  console.log('Middleware!');
  //const error = new Error("Not found");
 //error.status = 404;
  next();
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

/*
GET request using url, http://localhost:8080/api/message
Heroku app url, https://chatbot-server4800.herokuapp.com/api/message
*/
router.post('/message', function(req, res) {
      callDatabase(req.body.message, function(result){
        var parsedJson = JSON.parse(result);
        if(parsedJson.status.code != 200){
          res.json({
            message: "There is an error from the database side!",
            code: parsedJson.status.code,
            errorType: parsedJson.status.errorType,
            errorDetails: parsedJson.status.errorDetails
          });
        }
        else{res.json({ 
          newMessage: parsedJson.result.fulfillment.speech,
          statusCode: 200
        });
      }
    });
  });

  /*
  This method makes an api call to dialog flow created by the database team. A sessionID is a UUID uniquely identified for every request.
  Authorization header is required for request.
  */
function callDatabase(message, callback){ 
  Request.post({
    "headers": { 
      "content-type": "application/json",
      "Authorization": "Bearer aced3eb074ee44b0956904ec93a46507"},
    "url": "https://api.dialogflow.com/v1/query?v=20150910",
    "body": JSON.stringify({
      "query": message,
      "sessionId": uuidv4(),
      "lang":"en"
    })
  }, (error, response, body) => {
    if(error) {
      const error = new Error("Error from database!");
      next(error);
    }
    callback(body);
  });
}

/*
Natural Language Processing (NLP) is a subfield that studies the interaction between computers and 
humans (natural) languages. It can process and analyze large amounts of natural language data. 
Tokenization is a process in which it parses input and classifies sections of a string of input characters.
This function returns an array of each word in the sentence. 
*/
function nlpTokenizing(message){
  var tokenizer = new natural.WordTokenizer();
  //console.log(tokenizer.tokenize(message));
  return tokenizer.tokenize(message);
}

/*
Stemming reduces words to their stem/root word. It filters and removes 'stop words', which are 
common connecting words. Examples include 'the', 'at', 'is', 'which', and more. 
This function returns an array of each word remaining after stemming filtering.
*/
function nlpStemming(message){
  natural.PorterStemmer.attach();
  //console.log(message.tokenizeAndStem());
  return message.tokenizeAndStem();
}

//register routes
app.use('/api', router);

app.post('/api/posts', verifyToken, (req,res) => {
      res.json({
        message: 'Post created ...',
        authData
      });
  
});

app.post('/api/login', (req,res) => {
  // Creating a mock user. Usually have to create user and password but will do later

  const user = {
    id: 1,
    username: 'Brandon',
    email: 'brandon@gmail.com'
  }

  jwt.sign({user: user}, 'secretkey', (err,token) => {
    res.json({
      token: token
    });
  });
});


//start server
app.listen(port);
console.log('Server started on port ' + port);