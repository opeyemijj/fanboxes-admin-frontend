// utils/uploadToSpaces.js
import AWS from 'aws-sdk';


/**
 * Upload file to DigitalOcean Spaces inside 'track/' folder
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Optional upload progress callback
 * @returns {Promise<{ _id: string, url: string }>}
 */

function ensureHttps(url) {
  if (!url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
} 

const uploadToSpaces = (file, onProgress) => {


    const spaceEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com'); // Change region if needed

    const s3 = new AWS.S3({
    endpoint: spaceEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    });

  return new Promise((resolve, reject) => {
    const fileKey = `track/${Date.now()}-${file?.name}`;

    const upload = s3.upload({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileKey,
      Body: file,
      ACL: 'public-read',
      ContentType: file.type,
    });

    if (onProgress) {
      upload.on('httpUploadProgress', (evt) => {
        const percent = Math.floor((evt.loaded * 100) / evt.total);
        onProgress(percent);
      });
    }

    upload.send((err, data) => {
      if (err) return reject(err);
      resolve({
        _id: fileKey,
        url: ensureHttps(data.Location),
      });
    });
  });
};

export default uploadToSpaces;
