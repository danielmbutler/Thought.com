const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = async (event, context) => {

    // console.log('Received event:', JSON.stringify(event, null, 2));

    var params = { 
        Bucket: 'BUCKET'
    }

    console.log("Checkpoint 1");

    let s3Objects
    var filenames = [];

    try {
       s3Objects = await s3.listObjectsV2(params).promise();
       console.log(s3Objects.Contents)
       s3Objects.Contents.forEach(function(obj,index){
        filenames.push((obj.Key.split(':').join('%3A')));  //.replace(/^.*[\\\/]/, '')));
        return filenames;
    })
    } catch (e) {
       console.log(e)
    }

    
    console.log("Checkpoint 2");
    console.log(filenames);

    // Assuming you're using API Gateway
    return {
        statusCode: 200,
        body: filenames|| {message: 'No objects found in s3 bucket'}
    }

};

