const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken, hasRole } = require('../middleware/auth');

// @route   POST /api/upload
// @desc    Upload a single product/banner image
router.post('/single', verifyToken, hasRole(['admin', 'product_manager']), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully.',
      imageUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Single upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error uploading file.' });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple product images
router.post('/multiple', verifyToken, hasRole(['admin', 'product_manager']), upload.array('images', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select image files to upload.' });
    }

    const urls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully.`,
      imageUrls: urls
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error uploading files.' });
  }
});

module.exports = router;
