const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'centriflow') => {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        process.env.CLOUDINARY_CLOUD_NAME === 'your-cloudinary-name' ||
        !process.env.CLOUDINARY_API_KEY ||
        process.env.CLOUDINARY_API_KEY === 'your-cloudinary-key' ||
        !process.env.CLOUDINARY_API_SECRET ||
        process.env.CLOUDINARY_API_SECRET === 'your-cloudinary-secret') {
      console.log('Cloudinary not configured, skipping image upload');
      return {
        url: '',
        public_id: ''
      };
    }

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.log('Failed to upload image to Cloudinary, continuing without image:', error.message);
    return {
      url: '',
      public_id: ''
    };
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadImage,
  deleteImage
};
