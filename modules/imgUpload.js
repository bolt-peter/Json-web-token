'use strict';
const storage = require('@google-cloud/storage');
const fs = require('fs')
// Imports the Google Cloud client libraries
const Vision = require('@google-cloud/vision');

// Instantiates clients
const vision = Vision();

const gcs = storage({
  projectId: 'boltremit',
  keyFilename: './keyfile4.json'
});

const bucketName = 'boltimagebucket'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = (req, res, next) => {
  if(!req.file) return next();

  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    console.log('err', err)
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    const gcsPath = 'gs://boltimagebucket/' + gcsname;
    console.log('gcsPath:', gcsPath);
    // Performs text detection on the gcs file
    vision.textDetection({ source: { imageUri: gcsPath} })
      .then((results) => {
        const detections = results[0].textAnnotations;
        console.log(results);
        console.log('Text:', detections);
        // detections.forEach((text) => console.log(text));
        
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
        
    });
    stream.end(req.file.buffer);
    
}

module.exports = ImgUpload;