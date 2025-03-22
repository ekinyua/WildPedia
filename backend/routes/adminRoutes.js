const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { uploadToS3 } = require('../config/s3-config');


// Create species
router.post("/", uploadToS3.single('image'), async (req, res) => {
    const {
        scientific_name,
        vernacular_names,
        description,
        image_url,
        kingdom = "Animalia",
        kingdom_key = 1, // Default to Animalia
        className = null,
        class_key = null
    } = req.body;

    try {
        const image_url = req.file ? req.file.location : null;
        // unique identifier for this species if gbif_key is not provided
        const gbif_key = req.body.gbif_key || Math.floor(Math.random() * 10000000) + 90000000;
        const class_key = req.body.class_key || Math.floor(Math.random() * 100) + 900;

        // Create composite key
        const composite_key = `${gbif_key}_${kingdom_key}_${class_key || 'null'}`;

        // Process vernacular names if provided as string
        let processed_names;
        try {
            processed_names = typeof vernacular_names === 'string'
                ? JSON.parse(vernacular_names)
                : vernacular_names || [];
        } catch (e) {
            processed_names = vernacular_names ? [vernacular_names] : [];
        }

        await pool.query(
            `INSERT INTO species (
                composite_key, gbif_key, scientific_name, vernacular_names, 
                kingdom, kingdom_key, class, class_key, 
                description, image_url, image_source
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                composite_key,
                gbif_key,
                scientific_name,
                processed_names,
                kingdom,
                kingdom_key,
                className,
                class_key,
                description,
                image_url,
                'user_uploaded'
            ]
        );

        res.status(201).json({
            message: "Species added successfully",
            species: {
                composite_key,
                scientific_name,
                vernacular_names: processed_names
            }
        });
    } catch (error) {
        console.error("Error creating species:", error);
        res.status(500).json({ error: error.message });
    }
});

// Update species
router.put("/:compositeKey", uploadToS3.single('image'), async (req, res) => {
    const { compositeKey } = req.params;
    const { vernacular_names, description, image_url, scientific_name, class_name, habitat, threat_status } = req.body;
    try {
        const image_url = req.file ? req.file.location : req.body.image_url;

        // Parse vernacular names if provided
        let parsedNames;
        try {
            parsedNames = vernacular_names ? JSON.parse(vernacular_names) : null;
        } catch (e) {
            parsedNames = vernacular_names ? [vernacular_names] : null;
        }

        // Build the query based on what was provided
        let updateQuery = 'UPDATE species SET last_modified = CURRENT_TIMESTAMP';
        const updateParams = [];
        let paramCounter = 1;

        if (parsedNames) {
            updateQuery += `, vernacular_names = $${paramCounter}`;
            updateParams.push(parsedNames);
            paramCounter++;
        }

        if (description) {
            updateQuery += `, description = $${paramCounter}`;
            updateParams.push(req.body.description || '');
            paramCounter++;
        }

        if (habitat) {
            updateQuery += `, habitat = $${paramCounter}`;
            updateParams.push(habitat);
            paramCounter++;
        }

        if (threat_status) {
            updateQuery += `, threat_status = $${paramCounter}`;
            updateParams.push(threat_status);
            paramCounter++;
        }

        if (class_name) {
            updateQuery += `, class = $${paramCounter}`;
            updateParams.push(class_name);
            paramCounter++;
        }

        if (image_url) {
            updateQuery += `, image_url = $${paramCounter}, image_source = $${paramCounter + 1}`;
            updateParams.push(image_url, 'user_uploaded');
            paramCounter += 2;
        }

        if (scientific_name) {
            updateQuery += `, scientific_name = $${paramCounter}`;
            updateParams.push(scientific_name);
            paramCounter++;
        }

        console.log({
            "description value": description,
            "description type": typeof description,
            "is truthy?": !!description,
            "in request?": 'description' in req.body
        });

        // Complete the query
        updateQuery += ` WHERE composite_key = $${paramCounter} RETURNING *`;
        updateParams.push(compositeKey);

        const result = await pool.query(updateQuery, updateParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Species not found" });
        }

        res.json({
            message: "Species updated",
            species: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;