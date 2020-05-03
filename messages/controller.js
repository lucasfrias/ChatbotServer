const express = require('express');
const router = express.Router();
const messageService = require('./service');
const db = require('utility/db');
const userService = require('../users/service');
const { v4: uuidv4 } = require('uuid');
const User = db.User;

// routes
router.post('/', getMessage);

module.exports = router;

/*
GET request using url, http://localhost:8080/api/message
Heroku app url, https://chatbot-server4800.herokuapp.com/api/message
*/
function getMessage(req, res, next){
  if(req.body.username == null || req.body.username == ''){
    throw("Please include username in request or username must not be empty.");
  }

  if(req.body.message == null || req.body.message == ''){
    throw("Message must not be empty.");
  }

   userService.update(req.body.username)
   .then(user => messageService.callDatabase(user.sessionId, req.body.message, function(result){
    var parsedJson = JSON.parse(result);
    if(parsedJson.status.code != 200){
      res.json({
        message: "There is an error from the database side!",
        responseCode: parsedJson.status.code,
        errorType: parsedJson.status.errorType,
        errorDetails: parsedJson.status.errorDetails
      });
    }
    else{res.json({ 
      newMessage: parsedJson.result.fulfillment.speech,
      responseCode: 200
    });
  }
  }))
   .catch(err => next(err));

}