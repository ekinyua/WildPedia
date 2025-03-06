const express = require('express');
const router = express.Router();
const multer = require('multer');
const visionController = require('../controllers/vision.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Configure multer for memory storage (no file writing)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Image upload and identification route
router.post(
    '/identify',
    [verifyToken, upload.single('image')],
    visionController.identifySpecies
);

module.exports = router;