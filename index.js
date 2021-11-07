var AWS = require('aws-sdk');

require('dotenv').config();
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
});
var namefile = 'test.jpg';

/*
const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'kalsitbucket',
        Key: namefile, // File name you want to save as in S3
        Body: fileContent
    };
    const s3 = new AWS.S3();
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};
*/
var params = {
    Image: {
        S3Object: {
            Bucket: "kalsitbucket",
            Name: namefile
        }
    },
    MaxLabels: 10,
    MinConfidence: 70
};
console.log("START");
const rekognition = new AWS.Rekognition();
rekognition.detectLabels(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
})

console.log("END");