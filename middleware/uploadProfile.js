const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cloudinaryStorage = require("multer-storage-cloudinary");

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "cleanpro",
  allowedFormats: ["jpg", "jpeg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

// Export upload middleware
const uploadProfile = multer({ storage });

module.exports = uploadProfile;
