
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
    accessKeyId: 'ASIAQQK3445LI5NNRMBK',
    secretAccessKey: 'Dt0qzGyYwtpRQNCIs0aO3rw7xa72lIhonw3Z4G9p',
    sessionToken: 'FwoGZXIvYXdzEE8aDBXWlVIph1mPGldUmiLPAWWVQKlZ2NsVQ8KwbGQApczfKa1YLsD6JmWBkpY/8WmYmD9fJW6O5ZGIq5n6ppejrP17zgfKP9MS9VPCaXAITPWE+yw51TSQBA5XoqEjnaMqrA944G+j/3vHYH5dXPiYk2JRbcVDJCznwqNd99yTKAmHm+I80gg7jtoSPZobYmEE4di6giDl4VNItHFR+yWgqp1o2RsHozNdvVShGnagKCwVkM+IVbMcblKCGEHq/9BPXNg+G1JG+RHbpRADxe6AjmQDiI49QKKmZI05G4vYfCi1+52NBjItoDp7kPBTTOREY+TxMMRKXf1txyF3x7va9sLqnWd0l6dWUblzzjSRbFZc9sri',
    region: 'us-east-1',
    signatureVersion: 'v4',
});

const s3 = new aws.S3({});
const bucketName = 'rekognitionbucket18';

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
        bucket: bucketName,
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
				Bucket: bucketName,
				Name: req.file,
			},
		},
		MaxLabels: 5,
		MinConfidence: 80,
	};
	//console.log(req.file);
	rekognition.detectLabels(params, function (err, data) {
		if (err) console.log(err, err.stack);
		else res.send({data: data});
	});
})

app.post("/detectFace", upload.array("image", 1), (req, res) => {
    var params = {
		Image: {
			S3Object: {
				Bucket: bucketName,
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
				Bucket: bucketName,
				Name: req.file,
			},
		},
	};
	console.log(req.file);
	rekognition.detectText(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			console.log(data);
			res.send({data: data});
		} 
	});
})
app.post("/rekogCeleb", upload.array("image", 1), (req, res) => {
    var params = {
		Image: {
			S3Object: {
				Bucket: bucketName,
				Name: req.file,
			},
		},
	};
	console.log(req.file);
	rekognition.recognizeCelebrities(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			console.log(data);
			res.send({data: data});
		} 
	});
})


app.use(express.static("public"));

app.listen(3000,() => console.log('Server is running on port 3000'));
