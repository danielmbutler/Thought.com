const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


  // dummy event
  var event = {

}

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


if (event.Action === "follow"){

    console.log(event.FollowedUserID);
    console.log(event.FriendlyName);

    var Followerparams = {
        TableName:"ThoughtUsers",
        Key:{
            "UserID": event.FollowedUserID,
            
        },
        UpdateExpression: 'ADD Followers :vals',
        ExpressionAttributeValues: {
          ':vals'   : docClient.createSet([event.FriendlyName])
        },
      };
        ReturnValues:"UPDATED_NEW"


    var Followingparams = {
        TableName:"ThoughtUsers",
        Key:{
            "UserID": event.FollowingUserID,
            
        },
        UpdateExpression: 'ADD Following :r',
        ExpressionAttributeValues: {
          ":r"      :   docClient.createSet([event.FollowedUser]),
        },
      };
        ReturnValues:"UPDATED_NEW"
    

    var Notificationparams = {
        TableName:"ThoughtUsers",
        Key:{
            "UserID": event.FollowedUserID,
            
        },
        UpdateExpression: 'ADD Notifications :r',
        ConditionExpression: 'attribute_exists(UserID)',
        ExpressionAttributeValues: {
          ":r"      :   docClient.createSet([event.Notification]),
        },
      };
        ReturnValues:"UPDATED_NEW"

        const paramSet = [Followerparams,Notificationparams,Followingparams];

            await Promise.all(paramSet.map(async (params) => {
                const contents =  await DBQuery(params)
                console.log(contents)
              }));
             

        
    };
    

if (event.Action === 'unfollow'){

    var Unfollowparams = {
        TableName:"ThoughtUsers",
        Key:{
            "UserID": event.FollowedUserID,
            
        },
        UpdateExpression: 'DELETE Followers :vals',
        ExpressionAttributeValues: {
          ':vals'   : docClient.createSet([event.FriendlyName])
        },
      };
        ReturnValues:"UPDATED_NEW"
    
    

    var Followingparams = {
        TableName:"ThoughtUsers",
        Key:{
            "UserID": event.UnFollowingUserID,
            
        },
        UpdateExpression: "DELETE Following :r",
        ExpressionAttributeValues:{
            ":r"    :   docClient.createSet([event.UnFollowedUser]),
        },
    };
        ReturnValues:"UPDATED_NEW"

        var paramSet = [Unfollowparams,Followingparams];

        await Promise.all(paramSet.map(async (params) => {
            const contents =  await DBQuery(params)
            console.log(contents)
          }));
}






};
