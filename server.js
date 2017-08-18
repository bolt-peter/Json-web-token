const express = require('express');
var bodyParser = require('body-parser');
const imgUpload = require('./modules/imgUpload');
const Multer = require('multer');
const app = express();



//mongo
var models =  require('./models/models')
var User = models.User;

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//parse images
const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024
});


//twilio
// var twilio = require('twilio');
// var client = twilio('ACa6d84dc6c4cd8d2d16f1af34c5cba9c0', '60aeee41b73a10032979860ca2ec996e');
// app.get('/', function (req, res) {
//   res.send('hosted successfully');
// })

app.post('/', function(req,res){
	console.log('innnnnn');
})


app.post('/v1/verifications',function(req, res){
	console.log(req.body);
	var sample_code = 456789;
	sample_code= JSON.stringify(sample_code);
		client.messages.create({
		  to: req.body.phoneNumber,
		  from: '6502414376',
		  body: sample_code
	}, function(err, message){
		if(!err){
			res.send('verification code sent');
		}
	});
})

app.put('/v1/verifications', function(req,res){

	console.log(req.body);
	if(req.body.code === '456789'){
		res.json('success!');
	}

})


app.post('/image', multer.single('image'), imgUpload.uploadToGcs, function (req, res, next) {
  console.log(req.file.cloudStoragePublicUrl);
  const data = req.body;
  if (req.file && req.file.cloudStoragePublicUrl) {
    data.imageUrl = req.file.cloudStoragePublicUrl;
    
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})
