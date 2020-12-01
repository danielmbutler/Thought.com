const AWS = require('aws-sdk');
  
  //Table Name
  const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
    
  var params = {
    TableName: "notes",
    ProjectionExpression: "friendlyusername, content, createdAt, userId"
  };
  

  function DBQuery(){
    return new Promise(function(resolve, reject) {    
        docClient.scan(params, function(err, data) {
            if(err){
                console.log(err, null);
            }else{
                const DBresults = JSON.stringify(data);
                resolve(DBresults);
            }
            
        })
  });
  }
    

exports.handler = async (event, context) => {
  
  var DBresults = await DBQuery() 
  //console.log(JSON.parse(DBresults));
  return JSON.parse(DBresults);
};
