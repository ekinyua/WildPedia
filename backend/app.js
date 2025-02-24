require('dotenv').config();
const express = require('express');
const cors = require("cors");
const ipapi = require('ipapi.co');
const pool = require('./models/db');
const logger = require("./logger");

// Import all routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const culturalContentRoutes = require('./routes/cultural_content.routes');
const speciesFactsRoutes = require('./routes/species_facts.routes');
const { verifyToken } = require('./middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Log application start
logger.info("Application started successfully.");

// Mount all route groups
app.use('/api/admin/species', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cultural-content', culturalContentRoutes);
app.use('/api/species-facts', speciesFactsRoutes);

// Protected test route
app.use('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

// Route to fetch species based on search query or get all species
app.get("/api/species", async (req, res) => {
    try {
        let location = req.query.location || 'Kigali';
        let searchQuery = req.query.q || '';
        let query;
        let values;

        if (searchQuery) {
            // Search in scientific_name and vernacular_names
            query = `
                SELECT *
                FROM species
                WHERE scientific_name ILIKE $1
                OR vernacular_names::text ILIKE $1
                ORDER BY scientific_name
                LIMIT 12
            `;
            values = [`%${searchQuery}%`];
        } else {
            // Return all species
            query = `
                SELECT *
                FROM species
                ORDER BY scientific_name
                LIMIT 12
            `;
            values = [];
        }

        const result = await pool.query(query, values);

        // Format the response
        const formattedResults = result.rows.map(species => ({
            key: species.gbif_key,
            scientificName: species.scientific_name,
            vernacularNames: species.vernacular_names || [],
            rank: species.taxonomic_status,
            kingdom: species.kingdom,
            phylum: species.phylum,
            family: species.family,
            image: species.image_url || 'placeholder.jpg',
            compositeKey: species.composite_key
        }));

        res.json({ 
            results: formattedResults, 
            location 
        });

    } catch (error) {
        logger.error(`Error fetching species: ${error.message}`);
        res.status(500).json({ 
            error: "Error fetching species data",
            details: error.message 
        });
    }
});

// Route to fetch a single species by its composite key
app.get("/api/species/:compositeKey", async (req, res) => {
    try {
        const { compositeKey } = req.params;

        const query = `
            SELECT *
            FROM species
            WHERE composite_key = $1
        `;

        const result = await pool.query(query, [compositeKey]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Species not found"
            });
        }

        const species = result.rows[0];

        // Format the response
        const formattedSpecies = {
            key: species.gbif_key,
            scientificName: species.scientific_name,
            vernacularNames: species.vernacular_names || [],
            rank: species.taxonomic_status,
            kingdom: species.kingdom,
            phylum: species.phylum,
            family: species.family,
            class: species.class,
            order: species.order_name,
            genus: species.genus,
            specificEpithet: species.specific_epithet,
            habitat: species.habitat,
            description: species.description,
            image: species.image_url || 'placeholder.jpg',
            compositeKey: species.composite_key
        };

        res.json(formattedSpecies);

    } catch (error) {
        logger.error(`Error fetching species details: ${error.message}`);
        res.status(500).json({ 
            error: "Error fetching species details",
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
});