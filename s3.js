
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
    accessKeyId: 'ASIAX3ACOSCI5MMKT2GN',
    secretAccessKey: 'XmQNfTUTis72FDtS1pQ/vN/2c3jWAA0d6qHO6HgE',
    sessionToken: 'FwoGZXIvYXdzEGMaDKEdeSLwf44EsMPsfSLPAR9hDcUU2gzETmfq5OvXjjUI60bFUWRwy7XXXEufoZVKlZlvYV5wGUR+GMNozqbHP0xin7QnJ5n1ijf4f7A1ayrMlxmvAoBhyAisbX+/8yUvMjXouC3i1J0p+C5nJQro9HDZE8STIro9ELGchdpjoy060bPDUQqgIk8PaIFtzvWbHDjFnKycmCNTa4YQu+IOJ6jJPl2XYKGc0m++29h9KWaNNlTShCG3/DpLJ/t7mrp6a9omyvmEBP/0Q4Vkad7YVxM6aEoImX2VTbdqFLHiGyiyrKKNBjIt6h8L1PsVdd7k9zrc6LJjpIknToE7jok1cwsGI70bLjrkWfSLUbPrVeKyPCYO',
    region: 'us-east-1',
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
	rekognition.detectText(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			//console.log(data);
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
