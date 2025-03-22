const pool = require('../models/db');
const logger = require('../logger');
const { uploadToS3, deleteFromS3 } = require('../config/s3-config');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const speciesController = {
    // Get all species with filtering and pagination
    async getSpeciesList(req, res) {
        try {
            const {
                query = '',
                kingdom,
                class: className,
                limit = 10,
                offset = 0,
                sortBy = 'scientific_name',
                sortDir = 'ASC'
            } = req.query;

            // Build query with filters
            let sqlQuery = `
        SELECT * FROM species
        WHERE 1=1
      `;

            const queryParams = [];
            let paramCounter = 1;

            if (query) {
                sqlQuery += ` AND (scientific_name ILIKE $${paramCounter} OR vernacular_names::text ILIKE $${paramCounter})`;
                queryParams.push(`%${query}%`);
                paramCounter++;
            }

            if (kingdom) {
                sqlQuery += ` AND kingdom = $${paramCounter}`;
                queryParams.push(kingdom);
                paramCounter++;
            }

            if (className) {
                sqlQuery += ` AND class = $${paramCounter}`;
                queryParams.push(className);
                paramCounter++;
            }

            // Add sorting
            sqlQuery += ` ORDER BY ${sortBy} ${sortDir}`;

            // Add pagination
            sqlQuery += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
            queryParams.push(limit, offset);

            const result = await pool.query(sqlQuery, queryParams);

            // Get total count for pagination
            let countQuery = `
        SELECT COUNT(*) as total
        FROM species
        WHERE 1=1
      `;

            const countParams = [];
            let countParamCounter = 1;

            if (query) {
                countQuery += ` AND (scientific_name ILIKE $${countParamCounter} OR vernacular_names::text ILIKE $${countParamCounter})`;
                countParams.push(`%${query}%`);
                countParamCounter++;
            }

            if (kingdom) {
                countQuery += ` AND kingdom = $${countParamCounter}`;
                countParams.push(kingdom);
                countParamCounter++;
            }

            if (className) {
                countQuery += ` AND class = $${countParamCounter}`;
                countParams.push(className);
                countParamCounter++;
            }

            const countResult = await pool.query(countQuery, countParams);

            res.json({
                species: result.rows,
                total: parseInt(countResult.rows[0].total),
                page: Math.floor(offset / limit) + 1,
                pageSize: limit,
                totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
            });

        } catch (error) {
            logger.error(`Error fetching species list: ${error.message}`);
            res.status(500).json({
                message: "Error fetching species list",
                error: error.message
            });
        }
    },

    // Get taxonomic categories for dropdowns
    async getTaxonomyLists(req, res) {
        try {
            // Get kingdoms
            const kingdomsResult = await pool.query(
                `SELECT DISTINCT kingdom FROM species ORDER BY kingdom`
            );

            // Get classes
            const classesResult = await pool.query(
                `SELECT DISTINCT class FROM species ORDER BY class`
            );

            // Get orders
            const ordersResult = await pool.query(
                `SELECT DISTINCT order_name FROM species ORDER BY order_name`
            );

            // Get families
            const familiesResult = await pool.query(
                `SELECT DISTINCT family FROM species ORDER BY family`
            );

            res.json({
                kingdoms: kingdomsResult.rows.map(row => row.kingdom).filter(Boolean),
                classes: classesResult.rows.map(row => row.class).filter(Boolean),
                orders: ordersResult.rows.map(row => row.order_name).filter(Boolean),
                families: familiesResult.rows.map(row => row.family).filter(Boolean)
            });

        } catch (error) {
            logger.error(`Error fetching taxonomy lists: ${error.message}`);
            res.status(500).json({
                message: "Error fetching taxonomy lists",
                error: error.message
            });
        }
    },

    // Create new species
    async createSpecies(req, res) {
        // Use multer-s3 upload middleware
        const upload = uploadToS3.single('image');

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message
                });
            }

            // Start transaction
            await pool.query('BEGIN');

            try {
                const {
                    scientificName,
                    vernacularNames,
                    kingdom,
                    kingdomKey,
                    phylum,
                    phylumKey,
                    class: className,
                    classKey,
                    orderName,
                    orderKey,
                    family,
                    familyKey,
                    genus,
                    genusKey,
                    specificEpithet,
                    taxonomicStatus,
                    habitat,
                    threatStatus,
                    description
                } = req.body;

                // Validate required fields
                if (!scientificName || !kingdom || !kingdomKey) {
                    await pool.query('ROLLBACK');
                    return res.status(400).json({
                        message: "Scientific name, kingdom, and kingdom key are required"
                    });
                }

                // Create composite key for the species
                const compositeKey = `${genusKey || 'unknown'}_${kingdomKey}_${classKey || 'null'}`;

                // Get image URL if uploaded
                let imageUrl = null;
                let imageSource = 's3_upload';

                if (req.file) {
                    imageUrl = req.file.location; // S3 returns the URL in location property
                }

                // Parse vernacular names array from form data
                let parsedVernacularNames;
                try {
                    parsedVernacularNames = vernacularNames ? JSON.parse(vernacularNames) : [];
                } catch (e) {
                    parsedVernacularNames = vernacularNames ? [vernacularNames] : [];
                }

                // Insert the species
                const result = await pool.query(
                    `INSERT INTO species (
            composite_key, gbif_key, scientific_name, vernacular_names,
            kingdom, kingdom_key, phylum, phylum_key, class, class_key,
            order_name, order_key, family, family_key, genus, genus_key,
            specific_epithet, taxonomic_status, habitat, threat_status,
            description, image_url, image_source
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23
          ) RETURNING *`,
                    [
                        compositeKey,
                        genusKey || null, // Using genus key as gbif_key for now
                        scientificName,
                        parsedVernacularNames,
                        kingdom,
                        kingdomKey,
                        phylum,
                        phylumKey,
                        className,
                        classKey,
                        orderName,
                        orderKey,
                        family,
                        familyKey,
                        genus,
                        genusKey,
                        specificEpithet,
                        taxonomicStatus || 'ACCEPTED',
                        habitat,
                        threatStatus,
                        description,
                        imageUrl,
                        imageSource
                    ]
                );

                await pool.query('COMMIT');

                logger.info(`New species created: ${scientificName} (${compositeKey})`);

                res.status(201).json({
                    message: "Species created successfully",
                    species: result.rows[0]
                });

            } catch (error) {
                await pool.query('ROLLBACK');

                // If image was uploaded to S3, try to delete it
                if (req.file && req.file.location) {
                    try {
                        await deleteFromS3(req.file.location);
                    } catch (e) {
                        logger.error(`Failed to delete S3 image after failed species creation: ${e.message}`);
                    }
                }

                logger.error(`Error creating species: ${error.message}`);
                res.status(500).json({
                    message: "Error creating species",
                    error: error.message
                });
            }
        });
    },

    // Update existing species
    async updateSpecies(req, res) {
        // Use multer-s3 upload middleware
        const upload = uploadToS3.single('image');

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message
                });
            }

            // Start transaction
            await pool.query('BEGIN');

            try {
                const { compositeKey } = req.params;
                const {
                    scientificName,
                    vernacularNames,
                    habitat,
                    threatStatus,
                    description
                } = req.body;

                // Check if species exists
                const existingResult = await pool.query(
                    'SELECT * FROM species WHERE composite_key = $1',
                    [compositeKey]
                );

                if (existingResult.rows.length === 0) {
                    await pool.query('ROLLBACK');
                    return res.status(404).json({
                        message: "Species not found"
                    });
                }

                // Get image URL if uploaded
                let imageUrl = req.file ? req.file.location : existingResult.rows[0].image_url;

                // Parse vernacular names array from form data
                let parsedVernacularNames;
                try {
                    parsedVernacularNames = vernacularNames ? JSON.parse(vernacularNames) : null;
                } catch (e) {
                    parsedVernacularNames = vernacularNames ? [vernacularNames] : null;
                }

                // Build update query with only provided fields
                let updateQuery = 'UPDATE species SET last_modified = CURRENT_TIMESTAMP';
                const updateParams = [];
                let paramCounter = 1;

                if (scientificName) {
                    updateQuery += `, scientific_name = $${paramCounter}`;
                    updateParams.push(scientificName);
                    paramCounter++;
                }

                if (parsedVernacularNames) {
                    updateQuery += `, vernacular_names = $${paramCounter}`;
                    updateParams.push(parsedVernacularNames);
                    paramCounter++;
                }

                if (habitat) {
                    updateQuery += `, habitat = $${paramCounter}`;
                    updateParams.push(habitat);
                    paramCounter++;
                }

                if (threatStatus) {
                    updateQuery += `, threat_status = $${paramCounter}`;
                    updateParams.push(threatStatus);
                    paramCounter++;
                }

                if (description) {
                    updateQuery += `, description = $${paramCounter}`;
                    updateParams.push(description);
                    paramCounter++;
                }

                if (req.file) {
                    updateQuery += `, image_url = $${paramCounter}, image_source = $${paramCounter + 1}`;
                    updateParams.push(imageUrl, 's3_upload');
                    paramCounter += 2;
                }

                // Add the WHERE clause
                updateQuery += ` WHERE composite_key = $${paramCounter} RETURNING *`;
                updateParams.push(compositeKey);

                // Execute the update
                const result = await pool.query(updateQuery, updateParams);

                // If updating with new image and there was an old one, try to delete it from S3
                if (req.file && existingResult.rows[0].image_url &&
                    existingResult.rows[0].image_source === 's3_upload') {
                    try {
                        await deleteFromS3(existingResult.rows[0].image_url);
                    } catch (e) {
                        logger.error(`Failed to delete old S3 image after species update: ${e.message}`);
                    }
                }

                await pool.query('COMMIT');

                logger.info(`Species updated: ${compositeKey}`);

                res.json({
                    message: "Species updated successfully",
                    species: result.rows[0]
                });

            } catch (error) {
                await pool.query('ROLLBACK');

                // If image was uploaded to S3, try to delete it
                if (req.file && req.file.location) {
                    try {
                        await deleteFromS3(req.file.location);
                    } catch (e) {
                        logger.error(`Failed to delete S3 image after failed species update: ${e.message}`);
                    }
                }

                logger.error(`Error updating species: ${error.message}`);
                res.status(500).json({
                    message: "Error updating species",
                    error: error.message
                });
            }
        });
    }
};

module.exports = speciesController;