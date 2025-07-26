import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary with the credentials from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure the storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profile_pictures', // The name of the folder in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // This will resize the image to a 250x250 square, focusing on the face
    transformation: [{ width: 250, height: 250, crop: 'fill', gravity: 'face' }],
  },
});

// Create the Multer parser with the configured storage engine
const parser = multer({ storage: storage });

export default parser;