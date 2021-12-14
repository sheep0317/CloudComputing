
const express = require('express');
const bodyParser = require('body-parser');
const multerS3 = require("multer-s3");
const multer = require("multer");
const aws = require("aws-sdk");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4',
});

const s3 = new aws.S3({});
const bucketName = 'rekognitionbucket1801';

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

app.post("/detectTest", upload.array("image", 1), (req, res) => {
    //res.redirect(req.file.location);
    //res.send({ file: req.file });
	let theFinalResult = [];
    var params = {
		Image: {
			S3Object: {
				Bucket: bucketName,
				Name: req.file,
			},
		},
		MinConfidence: 80,
	};
	rekognition.detectLabels(params, function (err, data) {
		if (err) console.log(err, err.stack);
		else {
			labelData = data.Labels;
			console.log(labelData);
			finalResult = {
				text: {},
				celebrities: {},
			}
			let textFlag = false;
			let personFlag = false;
			let posterFlag = false;
			for (let i = 0; i < labelData.length; i++) {
				if (labelData[i].Name === "Text"){textFlag = true; continue;} 
				if (labelData[i].Name === "Page") {textFlag = true; continue;} 
				if (labelData[i].Name === "Paper") {textFlag = true; continue;} 
				if (labelData[i].Name === "Person") {personFlag = true; continue;} 
				if (labelData[i].Name === "Human") {personFlag = true; continue;} 
				if (labelData[i].Name === "Face") {personFlag = true; continue;} 
				if (labelData[i].Name === "Poster") {textFlag = true; continue;} 
				
			}
			if (textFlag && personFlag) {
				posterFlag = true;
				textFlag = false;
				personFlag = false;
			} 
			console.log(textFlag);
			console.log(personFlag);
			console.log(posterFlag);
			
			if (textFlag) {
				textResult = {}
				textParam = {
					Image: {
						S3Object: {
							Bucket: bucketName,
							Name: req.file,
						},
					},
				}
				rekognition.detectText(textParam, function (err, data) {
					if (err) console.log(err, err.stack);
					
					else{
						finalResult.text = data;
						finalResult.celebrities = null;
						res.send({data: finalResult});
					} 
				});
			}
			if (personFlag) {
				personParam = {
					Image: {
						S3Object: {
							Bucket: bucketName,
							Name: req.file,
						},
					},
				}
				rekognition.recognizeCelebrities(personParam, function (err, data) {
					if (err) console.log(err, err.stack);
					
					else{
						finalResult.text = null;
						finalResult.celebrities = data;
						res.send({data: finalResult});
					} 
				});
			}
			if (posterFlag) {
				posterResult = {}
				posterParam = {
					Image: {
						S3Object: {
							Bucket: bucketName,
							Name: req.file,
						},
					},
				}
				rekognition.detectText(posterParam, function (err, data) {
					if (err) console.log(err, err.stack);
					else{
						finalResult.text = data;
						rekognition.recognizeCelebrities(posterParam, function (err, data) {
							if (err) console.log(err, err.stack);
							
							else{
								console.log(typeof data);
								finalResult.celebrities = data;
								console.log(typeof posterResult);
								res.send({data: finalResult});
							} 
						});
					} 
				});
			}
		}
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
			console.log(data);
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
	//console.log(req.file);
	textDetection(params, res);
})
function textDetection (params, res){
	rekognition.detectText(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			console.log(data);
			res.send({data: data});
		} 
	});
}
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
			console.log(data.CelebrityFaces);
			res.send({data: data});
		} 
	});
})


app.use(express.static("public"));

app.listen(3000,() => console.log('Server is running on port 3000'));
