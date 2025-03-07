const vision = require('@google-cloud/vision');
const path = require('path');
const logger = require('../logger');
const fs = require('fs');

// Log the environment variable
console.log('Google Vision keyfile path:', process.env.GOOGLE_VISION_KEYFILE);

// Try different paths to locate the key file
const possiblePaths = [
    process.env.GOOGLE_VISION_KEYFILE,
    path.resolve(__dirname, '../neuralninevisionproject-449711-aa07c7cc5bae.json'),
    path.resolve(__dirname, '../../neuralninevisionproject-449711-aa07c7cc5bae.json'),
    './neuralninevisionproject-449711-aa07c7cc5bae.json'
];

let keyFilename = null;
for (const pathToCheck of possiblePaths) {
    if (pathToCheck && fs.existsSync(pathToCheck)) {
        console.log('Found key file at:', pathToCheck);
        keyFilename = pathToCheck;
        break;
    }
}

if (!keyFilename) {
    console.error('ERROR: Google Vision API key file not found in any of these locations:', possiblePaths);
    console.error('Please ensure the file exists and the path is correct in your .env file');
}

// Create a client for Google Vision API
const client = new vision.ImageAnnotatorClient({ keyFilename });

const visionService = {

    async identifySpecies(imageBuffer) {
        try {
            logger.info('Starting species identification with Vision API');

            // Request features from Vision API
            const request = {
                image: { content: imageBuffer },
                features: [
                    { type: 'LABEL_DETECTION', maxResults: 20 },
                    { type: 'OBJECT_LOCALIZATION', maxResults: 5 }
                ]
            };

            // Get response from Vision API
            const [response] = await client.annotateImage(request);

            // Check for errors
            if (response.error) {
                logger.error(`Vision API error: ${response.error.message}`);
                throw new Error(`Vision API error: ${response.error.message}`);
            }

            // Process label annotations (general descriptions)
            const labels = response.labelAnnotations || [];

            // Process object annotations (specific objects)
            const objects = response.localizedObjectAnnotations || [];

            // Find the most likely species
            let speciesName = null;
            let confidence = 0;
            let allDetectedLabels = [];
            let objectSpecies = null;
            let objectConfidence = 0;

            // First try object detection which often gives specific species
            for (const obj of objects) {
                allDetectedLabels.push({
                    name: obj.name,
                    score: obj.score,
                    type: 'object'
                });

                // Many animals/species will be detected as objects
                if (obj.score > objectConfidence) {
                    objectSpecies = obj.name;
                    objectConfidence = obj.score;
                }
            }

            // Then check labels which can be more detailed for species
            for (const label of labels) {
                allDetectedLabels.push({
                    name: label.description,
                    score: label.score,
                    type: 'label'
                });

                // These terms often indicate specific species names
                const isPotentialSpecies =
                    !['animal', 'bird', 'wildlife', 'terrestrial animal', 'nature'].includes(
                        label.description.toLowerCase()
                    );

                if (label.score > confidence && isPotentialSpecies) {
                    speciesName = label.description;
                    confidence = label.score;
                }
            }

            // If we couldn't identify a species
            if (!speciesName) {
                throw new Error('Unable to identify any species in this image. Please try a different image.');
            }

            logger.info(`Identified species: ${speciesName} with confidence ${confidence}`);

            // Return the identified species with all detected labels for reference
            return {
                species: speciesName,
                confidence: confidence * 100, // Convert to percentage
                allDetections: allDetectedLabels.sort((a, b) => b.score - a.score)
            };
        } catch (error) {
            logger.error(`Error in vision service: ${error.message}`);
            throw error;
        }
    }
};

module.exports = visionService;