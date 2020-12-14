const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  

    

exports.handler = async (event, context) => {
  var userids = []
 
     function DBQuery (params) {
        return new Promise(function(resolve, reject) {    
             docClient.query(params, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = (data.Items[0].Following.values);
                    
                    resolve(DBresults)
                }
                
            })
      });
      }

      function PostQuery (userid) {
                  // Get Posts of followers  
          const params = {
            TableName: "notes",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
              ":userId": userid,
            },
          }

        return new Promise(function(resolve, reject) {    
             docClient.query(params, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = data;
                    
                    resolve(DBresults)
                }
                
            })
      });
      }
    
      function FollowerIDQuery(UserID){

          return new Promise(function(resolve, reject) {
  
            var params = {
              TableName: "ThoughtUsersReverse",
              KeyConditionExpression: "Username = :userId",
              // 'ExpressionAttributeValues' defines the value in the condition
              // - ':userId': defines 'userId' to be the id of the author
              ExpressionAttributeValues: {
                ":userId": UserID.substring(0, (UserID).lastIndexOf("@")),
              },
              
            };
  
              docClient.query(params, function(err, data) {
                  if(err){
                      console.log(err, null);
                  }else{
                      const DBresults = (data.Items[0].UserID);
                      userids.push(DBresults)
                      resolve(DBresults)
                  }
                  
              })
        });
  
      }

    // Get Followers of User
    
    var Followersparams = {
      TableName: "ThoughtUsers",
      KeyConditionExpression: "UserID = :userId",
      // 'ExpressionAttributeValues' defines the value in the condition
      // - ':userId': defines 'userId' to be the id of the author
      ExpressionAttributeValues: {
        ":userId": event.UserID,
      },
      
    };

      
        // get users that account follows
        var Following   = await DBQuery(Followersparams)

        //get user ids for each user

        for (var i = Following.length - 1; i >= 0; i--) {
        var followingID = await FollowerIDQuery(Following[i])
        
          }
        //console.log(userids)

        //get posts for each user

         for (var i = userids.length - 1; i >= 0; i--) {
          var posts = await PostQuery(userids[i])
          //console.log(userids[i])
          console.log(posts)
            }

  
};
exports.handler(event);