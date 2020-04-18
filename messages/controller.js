const express = require('express');
const router = express.Router();
const messageService = require('./service');

// routes
router.post('/', getMessage);

module.exports = router;

/*
GET request using url, http://localhost:8080/api/message
Heroku app url, https://chatbot-server4800.herokuapp.com/api/message
*/
function getMessage(req, res, next){
    messageService.callDatabase(req.body.message, function(result){
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
    });
}