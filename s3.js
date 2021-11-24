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
    accessKeyId: 'ASIAQQK3445LEDLIHK5G',
    secretAccessKey: '2iD+eHjlRrVDfoD2hBn25Sf3v2nix8G1K2d4Wt36',
    sessionToken: 'FwoGZXIvYXdzEKf//////////wEaDAbD9t99Ag8ou31+MyLPAXfjgdrcGxEiDX3r7OvXbPNkHCSZv8bhJOPqGvnlvkrHIh7qADCreZ+VnDqvhjiQxcudUg5Rf2OeN99cZIZ1TZazf362XXW2YK2OVOzHvkgFBusrM6ldT4KUCWHYFg1Zb+SLetJ0rW8hlIIYye4QF6xZuVaPBHaIHd/JspEc773Wl3/DZ/5IQ5n1sDhPdV0Id9Ld1LJbRzWW9d41LPZ2obIwnhr1qx6GOkLWKQrzO9a+lR13Q4iuE+bkhlonYqBG2EZOBtkDF2KwN7pwit1W4CjL8PiMBjIt6y1wEm9KKrzaENrigemLvXZd63OYpgMjOP5AfBpxN/hWxkJfROK95yQhKK7K',
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

app.post("/detectText", upload.array("image", 1), (req, res) => {
    var params = {
		Image: {
			S3Object: {
				Bucket: 'rekognitionbucket18',
				Name: req.file,
			},
		},
	};
	console.log(req.file);
	rekognition.detectText(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			//console.log(data);
			res.send({data: data});
		} 
	});
})



app.use(express.static("public"));

app.listen(3000,() => console.log('Server is running on port 3000'));
