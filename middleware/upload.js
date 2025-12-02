const multer = require("multer");
const path = require("path");

// Store images in /uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Accept only images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only JPEG/PNG images allowed"), false);
  } else {
    cb(null, true);
  }
};

module.exports = multer({ storage, fileFilter });
