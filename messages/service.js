var Request    = require("request");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    callDatabase
};

var sessionId = uuidv4();

/*
This method makes an api call to dialog flow created by the database team. A sessionID is a UUID uniquely identified for every session.
Authorization header is required for request.
*/
function callDatabase(message, callback){ 
    //console.log(sessionId);
    Request.post({
      "headers": { 
        "content-type": "application/json",
        "Authorization": "Bearer aced3eb074ee44b0956904ec93a46507"},
      "url": "https://api.dialogflow.com/v1/query?v=20150910",
      "body": JSON.stringify({
        "query": message,
        "sessionId": sessionId,
        "lang":"en"
      })
    }, (error, response, body) => {
      if(error) {
        throw("Error from database!\nDetails: " + error);
      }
      callback(body);
    });
  }