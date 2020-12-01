const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


  // dummy event


exports.handler = async (event, context) => {

    console.log(event);

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
    
      if (event.Action === "REMOVE"){  
      var params = {
        TableName:"ThoughtUsers",
        Key:{
            "UserID": event.UserID,
            
        },
        UpdateExpression: 'DELETE Notifications :vals',
        ExpressionAttributeValues: {
          ':vals'   : docClient.createSet([event.Notifications])
        },
      };
        ReturnValues:"UPDATED_NEW"    

        const contents =  await DBQuery(params)
        console.log(contents)
    }
    if (event.Action === "ADD"){
        var params = {
            TableName:"ThoughtUsers",
            Key:{
                "UserID": event.UserID,
                
            },
            UpdateExpression: 'ADD Notifications :r',
            ConditionExpression: 'attribute_exists(UserID)',
            ExpressionAttributeValues: {
              ":r"      :   docClient.createSet([event.Notification]),
            },
          };
            ReturnValues:"UPDATED_NEW"
       
    
            const contents =  await DBQuery(params)
            console.log(contents)
    }

};
