// Imports the Google Cloud client libraries
const Vision = require('@google-cloud/vision');

// Instantiates clients
const vision = Vision();


const gcsPath = `gs://boltimagebucket/` + imagename;

// Performs text detection on the gcs file
vision.textDetection({ source: { imageUri: gcsPath } })
  .then((results) => {
    const detections = results[0].textAnnotations;
    console.log('Text:');
    detections.forEach((text) => console.log(text));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });