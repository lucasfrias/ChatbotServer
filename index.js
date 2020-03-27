var express    = require('express');      
var app        = express();                 
var bodyParser = require('body-parser');
var natural    = require('natural');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send("Welcome to CS 4800 Server!")
  });

//set port
const port = process.env.PORT || 3000;

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
      statusCode: 200,
      tokenize: nlpTokenizing(req.body.message),
      stems: nlpStemming(req.body.message)});
    });



/*
Natural Language Processing (NLP) is a subfield that studies the interaction between computers and 
humans (natural) languages. It can process and analyze large amounts of natural language data. 
Tokenization is a process in which it parses input and classifies sections of a string of input characters.
This function returns an array of each word in the sentence. 
*/
function nlpTokenizing(message){
  var tokenizer = new natural.WordTokenizer();
  console.log(tokenizer.tokenize(message));
  return tokenizer.tokenize(message);
}

/*
Stemming reduces words to their stem/root word. It filters and removes 'stop words', which are 
common connecting words. Examples include 'the', 'at', 'is', 'which', and more. 
This function returns an array of each word remaining after stemming filtering.
*/
function nlpStemming(message){
  natural.PorterStemmer.attach();
  console.log(message.tokenizeAndStem());
  return message.tokenizeAndStem();
}

//register routes
app.use('/api', router);

//start server
app.listen(port);
console.log('Running on port ' + port);