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
    accessKeyId: 'ASIAQQK3445LJAAY6FXL',
    secretAccessKey: 'RtJOm1UR4X4QGWZJw5glV5lYSJ4zR5S9z8vFggv2',
    sessionToken: 'FwoGZXIvYXdzEJ7//////////wEaDCTji3CN9+NkuzvNESLPARDroAlOdeDT9WDw6pIpuxYqwaxaGkv9+OooNxY55lWFkWGFsKUm7pMzCZ+F2B66cdnMk9gLvE6cxIqxvcdyJlHcuU+lS/0HlPPnoF8djFZI4tU76xez1FvhKy/gf1Vjhcam/fQXquaocZ5Qlb/cN6yNcwjOB4T74MJF5Dkr632dOOY7z4kLtOK9Fzq38UzbGBWo+II5Bd5Fz4nR7qBKBeRlqXL+HINbyyncIjxpy4IoOGgMhcUukbWQjDHJJop+ftn34l94tg8F2zCW3IaMyiiu6r6MBjItxobljGD6EI6Yai2lMSkdBkDregmxGQZJfVui6vfsROn3zJzfIggFzB3gp/tB',
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
app.post("/save-image", upload.array("image", 1), (req, res) => {
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



app.use(express.static("public"));

app.listen(9000,() => console.log('Server is running on port 9000'));
