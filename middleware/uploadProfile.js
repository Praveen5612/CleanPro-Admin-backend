const multer = require("multer");
const path = require("path");

// Storage Engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/profile"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique file name
  }
});

// File filter (validate images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
