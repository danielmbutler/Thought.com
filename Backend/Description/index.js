const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


  // dummy event
  var event = {
    "UserID"              : "user",
    "Description"         : "Account Description"
}

exports.handler = async (event, context) => {

    console.log(event);
    console.log("test YOUTUBE")

    function DBQuery(params){
        return new Promise(function(resolve, reject) {    
            docClient.update(params, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = JSON.stringify(data);
                    console.log(DBresults, "success");
                }
                
            })
      });
      }
     

        var params = {
            TableName:"ThoughtUsers",
            Key:{
                "UserID": event.UserID,
            },
            UpdateExpression: 'SET Description = :vals',
            ExpressionAttributeValues: {
              ':vals'   : event.Description
            },
          };
            ReturnValues:"UPDATED_NEW"

        var DBresults = await DBQuery(params) 
        //console.log(JSON.parse(DBresults));
        return JSON.parse(DBresults);
    
};
