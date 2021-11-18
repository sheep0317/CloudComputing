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
    accessKeyId: 'ASIAQQK3445LN75ELYOE',
    secretAccessKey: '3Iwcdd0ha0fk0Hxa+9GL/UBgK+tfWynu2PU0hPbS',
    sessionToken: 'FwoGZXIvYXdzEAwaDFoXYpmQnJi1yeKQQSLPAX/6UhztpwZKOc7ZVd44WDw07npEPdJkX6MWsLb8ibHfMaKE4XqYB9PyGKzTgbDXzc+1iXh566ELh7U1w6/0WJWnu05fETc5dHLRCqzKjd8DLxafJwgMBmNI3wkCfXi0lQS0YH5PAoIXi5XW+ISalDXb/DMIVKus+KGrgfYIlOti3mHxcLn/pGteQcw5mVQffeYXnHp12dWeibQKPQOcNh+3/xmbYUD/WGQkvLXCPXJUrVLL01bLwInwb9+kzW9heu1Uy55AFXkCCYfM6yWRCCiz/9aMBjIt8Y+2+4MAE5OxHp6SrPMg86BU29T4/iKGOwLgTY5RWsBzLw+iVn63giY7l2lf',
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
    //res.redirect(req.file.location);
    //res.send({ file: req.file });
    var params = {
		//CollectionId: "childs",
		//DetectionAtributes: [],
		Image: {
			S3Object: {
				Bucket: 'rekognitionbucket18',
				Name: req.file,
			},
		},
		//MaxLabels: 5,
		//MinConfidence: 80,
	};
	console.log(req.file);
	rekognition.detectFaces(params, function (err, data) {
		if (err) console.log(err, err.stack);
		
		else{
			
			//data1 = data1[0].BoundingBox;
			//console.log(data);
			res.send({data: data});
		} 
	
		//else console.log(JSON.stringify(data, null, '\t'));;
	});
})



app.use(express.static("public"));

app.listen(9000,() => console.log('Server is running on port 9000'));
