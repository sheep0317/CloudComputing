require("dotenv").config;
const express = require('express');
const bodyParser = require('body-parser');
const multerS3 = require("multer-s3");
const multer = require("multer");
const aws = require("aws-sdk");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

aws.config.update({
    accessKeyId: 'ASIAQQK3445LBALZU2IO',
    secretAccessKey: 'wvBAAYw+kdtiL3KQUFWBMsHULYig516TZK82SQx/',
    sessionToken: 'FwoGZXIvYXdzEBMaDPV3z7iUsZVx8Gbb7CLPAbbVZpRxuu4tUj8nLi5q/WN1OeAkck6Nj5dSwiPvoxChbRgfr8lLuLDuAsKXry9LVNkgmmpk6Xq37la0qh1CNswtIG1blV+KxJVCWBDwKIuBtsgoKGkkbjpUAmV6zV+V4p0ah8zizdP922/QVrl8Q8q5k2FXlP6PKiKNa3C9zU96ntPyw8T58Mfy60R7Vp7zmVZCQaqhXUze7ySYT5U1SRWaBgc1iOXQxWVR+jkrjbEIDvZQozPvwBo+85I+Y7+xxlzrJ6J9VCniialzpamlJCiLwtiMBjItIJT87HUDexU3wq9iEQKYNCQLhS74A0ChjAkNzS6yYoGsMvCIwKDiwpEXzD/P',
    region: 'us-east-1',
    signatureVersion: 'v4',
});
const s3 = new aws.S3({});

const upload = multer({
    fileFilter: (req, file, cb) => {
		if (
			file.mimetype === 'application/octet-stream' ||
			file.mimetype === 'video/mp4' ||
			file.mimetype === 'image/jpeg' ||
			file.mimetype === 'image/png'
		) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type'), false);
		}
	},
    storage: multerS3({
        acl:'public-read',
        s3:s3,
        bucket: 'rekognitionbucket18',
        key: function (req, file, cb) {
			req.file = Date.now() + file.originalname;
			cb(null, Date.now() + file.originalname);
		},
    })
})

const rekognition = new aws.Rekognition();
app.post("/detectLabel", upload.array("image", 1), (req, res) => {
    //res.redirect(req.file.location);
    //res.send({ file: req.file });
    var params = {
		Image: {
			S3Object: {
				Bucket: 'rekognitionbucket18',
				Name: req.file,
			},
		},
		MaxLabels: 5,
		MinConfidence: 80,
	};
	console.log(req.file);
	rekognition.detectLabels(params, function (err, data) {
		if (err) console.log(err, err.stack);
		else res.send({data: data});
	});
})

app.post("/detectFace", upload.array("image", 1), (req, res) => {
    var params = {
		Image: {
			S3Object: {
				Bucket: 'rekognitionbucket18',
				Name: req.file,
			},
		},
	};
	console.log(req.file);
	rekognition.detectFaces(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			res.send({data: data});
		} 
	});
})



app.use(express.static("public"));

app.listen(3000,() => console.log('Server is running on port 3000'));
