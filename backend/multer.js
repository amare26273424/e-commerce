const multer = require('multer');
const path = require('path');
// Set up Multer storage and file upload options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where you want to store the uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize Multer with the storage engine

const upload = multer({ storage: storage });

module.exports = upload;
