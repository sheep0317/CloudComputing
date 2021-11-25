
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
    accessKeyId: 'ASIAQQK3445LITPXV44G',
    secretAccessKey: 'viIbRrS2hjJd/kLZPrC9MD/XOYutJZegElKDbI8t',
    sessionToken: 'FwoGZXIvYXdzEL3//////////wEaDOjiAxgMBcqe8RX/UyLPAVqp/Fn9496nEx6uJp9FElP9M0y/ouNGNoLZiyDmBAdjk+5gTLFqrgiczVuuDLgsSt25JKxBLdHApwZUlSr4xLSI4hFfcH/XjgEffa2KP8t9+wE8Rvv8rGnmxvgChNkLOUlu3pwB/495+1tN2nP6q+iew5TVK6yEanlc2Te5neJuiBCfqp1rEH24zCTo73JFe2k0fQlQA+MeKW3jpN+LjwculepsQkTIvLBd8BbuPfL+N0PrmTLm7yF92KgO+1SZzqXYgQbJJxskMB5ptB6U0Sii5v2MBjItHon9cW7HSb4XZAKfjCifuPlqK4emZr/9OCGsic5EXuLNt2q/v1yNK00XcN/v',
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



app.use(express.static("public"));

app.listen(3000,() => console.log('Server is running on port 3000'));
