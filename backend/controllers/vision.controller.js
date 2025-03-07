const visionService = require('../services/visionService');
const logger = require('../logger');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const visionController = {
    async identifySpecies(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No image file uploaded"
                });
            }

            // Get the uploaded file
            const imageBuffer = req.file.buffer;

            // Process with Vision API
            const result = await visionService.identifySpecies(imageBuffer);

            // Save the image for future reference
            const fileName = `${uuidv4()}-${req.file.originalname}`;
            const filePath = path.join(uploadDir, fileName);

            // Only save if not in test mode
            if (process.env.NODE_ENV !== 'test') {
                fs.writeFileSync(filePath, imageBuffer);
                logger.info(`Saved uploaded image: ${filePath}`);
            }

            // Return the species information
            res.json({
                message: "Species identified successfully",
                result
            });
        } catch (error) {
            logger.error(`Error identifying species: ${error.message}`);
            res.status(500).json({
                message: "Error identifying species",
                error: error.message
            });
        }
    }
};

module.exports = visionController;