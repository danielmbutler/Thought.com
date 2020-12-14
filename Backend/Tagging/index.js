const AWS = require('aws-sdk');
var lambda = new AWS.Lambda();
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


  // dummy event




exports.handler = async (event, context) => {

    console.log(event);

    function DBQuery(params){
        return new Promise(function(resolve, reject) {    
            docClient.query(params, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = (data);
                    console.log(DBresults, "success");
                    var userId = DBresults.Items
                    const LambdaPost = {
           
                        "UserID"       : userId[0].UserID,
                        "Notification" : event.Notification,
                        "Action"       : "ADD"
                        
                    };

                    var Lambdaparams = {
                        FunctionName: 'ThoughtNotifications', // the lambda function we are going to invoke
                        InvocationType: 'RequestResponse',
                        LogType: 'Tail',
                        Payload: JSON.stringify(LambdaPost)
                      };
                    
                      lambda.invoke(Lambdaparams, function(err, data) {
                        if (err) {
                          context.fail(err);
                        } else {
                          context.succeed('Lambda_B said '+ data.Payload);
                        }
                      });
                
                    console.log(LambdaPost);
                    return LambdaPost

                }
                
            })
      });
      }  
      var Reverseparams = {
        TableName: "ThoughtUsersReverse",
        KeyConditionExpression: "Username = :userId",
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be the id of the author
        ExpressionAttributeValues: {
          ":userId": event.UserID,
        },
        
      };

    
     var result = await DBQuery(Reverseparams);
     console.log(result);

    

};


