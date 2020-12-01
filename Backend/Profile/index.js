const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
    

exports.handler = async (event, context) => {
    function DBQuery(){
        return new Promise(function(resolve, reject) {    
            docClient.query(params, function(err, data) {
                if(err){
                    console.log(err, null);
                }else{
                    const DBresults = JSON.stringify(data);
                    resolve(DBresults);
                }
                
            })
      });
      }
    const params = {
        TableName: "notes",
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        KeyConditionExpression: "userId = :userId",
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be the id of the author
        ExpressionAttributeValues: {
          ":userId": 'us-east-1:f1605db2-6968-4d59-af4f-ee2926225587',
        },
      };
      
    //console.log(event.path);
  
  var DBresults = await DBQuery() 
  console.log(JSON.parse(DBresults));
  return JSON.parse(DBresults);
};
exports.handler();

