const express = require('express');
const multer = require('multer');
const path = require('path'); // Import the path module
const app = express();
const PORT = 3000;

// Set storage engine for Multer
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

// Define a POST route for uploading images
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
