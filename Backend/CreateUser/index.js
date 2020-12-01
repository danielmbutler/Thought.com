const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


  // dummy event


exports.handler = async (event, context) => {

    console.log(event);

    function DBQuery(params){
        return new Promise(function(resolve, reject) {    
            docClient.put(params, function(err, data) {
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
            "Item": {
                "UserID"        : event.UserID,
                "FriendlyName"  : event.email
            }
        }
       
    
            const contents =  await DBQuery(params)
            console.log(contents)
    

};