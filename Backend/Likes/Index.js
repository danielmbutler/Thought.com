const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
   

exports.handler = async (event, context) => {

    console.log(event);

    function DBQuery(){
        return new Promise(function(resolve, reject) {    
            docClient.update(params, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = JSON.stringify(data);
                    resolve(DBresults);
                }
                
            })
      });
      }
      function CounterQuery(){
        return new Promise(function(resolve, reject) {    
            docClient.update(LikeCounterparams, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = JSON.stringify(data);
                    resolve(DBresults);
                }
                
            })
      });
      }

if (event.Action === 'Like'){

    var params = {
        TableName:"notes",
        Key:{
            "userId": event.Userid,
            "noteId": event.NoteId
        },
        UpdateExpression: 'ADD Likedby :vals',
        ExpressionAttributeValues: {
          ':vals'   : docClient.createSet([event.LikedBy])
        },
      };
        ReturnValues:"UPDATED_NEW"


    var LikeCounterparams = {
        TableName:"notes",
        Key:{
            "userId": event.Userid,
            "noteId": event.NoteId
        },
        UpdateExpression: 'ADD Likes :r',
        ExpressionAttributeValues: {
          ":r"      :   +1,
        },
      };
        ReturnValues:"UPDATED_NEW"
    };
    

if (event.Action === 'Unlike'){

    var params = {
        TableName:"notes",
        Key:{
            "userId": event.Userid,
            "noteId": event.NoteId
        },
        UpdateExpression: 'DELETE Likedby :vals',
        ExpressionAttributeValues: {
          ':vals'   : docClient.createSet([event.UnlikedBy])
        },
      };
        ReturnValues:"UPDATED_NEW"
    
    

    var LikeCounterparams = {
        TableName:"notes",
        Key:{
            "userId": event.Userid,
            "noteId": event.NoteId
        },
        UpdateExpression: "ADD Likes :r",
        ExpressionAttributeValues:{
            ":r"    :   -1,
        },
    };
        ReturnValues:"UPDATED_NEW"
    

}

var DBresults = await DBQuery()
var DBresultsCounter = await CounterQuery()
return JSON.parse(DBresults, DBresultsCounter);




};


