require('dotenv').config();
const cors = require("cors");
const express = require('express');
const fetch = require('node-fetch');
const ipapi = require('ipapi.co');
const adminRoutes = require('./routes/adminRoutes');

const { verifyToken, isAdmin, isModerator } = require('./middleware/auth.middleware');
const authRoutes = require('./routes/auth.routes');
const pool = require('./models/db');

const app = express();

app.use(cors());
app.use(express.json());

const logger = require("./logger");

logger.info("Application started successfully.");
logger.warn("This is a warning message.");
logger.error("An error occurred.");

// Admin routes
app.use('/api/admin/species', adminRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// User management routes
app.use('/api/users', require('./routes/user.routes'));

// Cultural content routes
app.use('/api/cultural-content', require('./routes/cultural_content.routes'));

// Species facts routes
app.use('/api/species-facts', require('./routes/species_facts.routes'));

app.use('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  });

const GBIF_API_BASE_URL = "https://api.gbif.org/v1";
const INATURALIST_API_BASE_URL = "https://api.inaturalist.org/v1";

// Helper function to fetch data from GBIF
async function fetchFromGBIF(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GBIF API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch from GBIF: ${error.message}`);
  }
}

// Helper function to fetch data from iNaturalist
async function fetchFromINaturalist(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`iNaturalist API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch from iNaturalist: ${error.message}`);
  }
}

// Helper function to clean scientific names
function cleanScientificName(name) {
  const parts = name.split(' ');
  const genus = parts[0] || '';
  const species = parts[1] || '';
  return `${genus} ${species}`.trim();
}

// Helper function to fetch images from iNaturalist
async function fetchImagesFromINaturalist(speciesName) {
    try {
      const url = `${INATURALIST_API_BASE_URL}/search?q=${encodeURIComponent(speciesName)}&include_taxon_ancestors=false`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`iNaturalist API error: ${response.statusText}`);
      const data = await response.json();
  
      console.log(`iNaturalist data for ${speciesName}:`, data); // Debugging statement
  
      if (data.results.length > 0 && data.results[0].record.default_photo) {
        return data.results[0].record.default_photo.medium_url; // Return the default photo's medium URL
      }
      return null;
    } catch (error) {
      console.error(`Error fetching images from iNaturalist for ${speciesName}:`, error);
      return null;
    }
  }

// NEW: Helper function to fetch scientific name from iNaturalist
async function fetchScientificNameFromINaturalist(query) {
  try {
    const url = `${INATURALIST_API_BASE_URL}/search?q=${encodeURIComponent(query)}&results=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`iNaturalist API error: ${response.statusText}`);
    const data = await response.json();
    if (data.results.length > 0 && data.results[0].record) {
      return data.results[0].record.scientific_name;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching scientific name from iNaturalist for "${query}":`, error.message);
    return null;
  }
}

// Route to fetch species based on search query or user's location
app.get("/api/species", async (req, res) => {
    try {
      let location = req.query.location || 'Kigali';
      let searchQuery = req.query.q || '';
  
      let speciesData;
      if (searchQuery) {
        // Use GBIF's search endpoint with filters to get multiple results
        const apiUrl = `${GBIF_API_BASE_URL}/species/search?q=${encodeURIComponent(searchQuery)}&rank=species&kingdom=Animalia&extension=vernacularName&limit=12`;
        speciesData = await fetchFromGBIF(apiUrl);
      } else {
        // Location-based search
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const geoData = await ipapi.location(ip);
        location = `${geoData.city}, ${geoData.country_name}`;
        const apiUrl = `${GBIF_API_BASE_URL}/species/search?country=${geoData.country_code}&kingdom=Animalia&limit=12`;
        speciesData = await fetchFromGBIF(apiUrl);
      }
  
      // Normalize species data (single object vs array)
      let results = [];
      if (speciesData.results) { // Multiple species
        results = speciesData.results;
      }
  
      const formattedResults = await Promise.all(
        results.map(async (rawSpecies) => {
          let image = null;
          let scientificName = rawSpecies.canonicalName || rawSpecies.scientificName || '';
          let vernacularNames = rawSpecies.vernacularNames?.map(vn => vn.vernacularName) || [];
  
          // Fetch image from iNaturalist
          try {
            const inatResponse = await fetchFromINaturalist(
              `${INATURALIST_API_BASE_URL}/search?q=${encodeURIComponent(scientificName)}&include_taxon_ancestors=false`
            );
            if (inatResponse.results.length > 0 && inatResponse.results[0].record.default_photo) {
              image = inatResponse.results[0].record.default_photo.medium_url;
            }
          } catch (error) {
            console.error(`iNaturalist image fetch error:`, error);
          }
  
          return {
            key: rawSpecies.key,
            scientificName,
            vernacularNames,
            genus: rawSpecies.genus?.scientificName || rawSpecies.parent?.scientificName || '',
            species: rawSpecies.species?.scientificName || '',
            rank: rawSpecies.rank,
            kingdom: rawSpecies.kingdom?.scientificName || '',
            phylum: rawSpecies.phylum?.scientificName || '',
            family: rawSpecies.family?.scientificName || '',
            image: image || 'placeholder.jpg',
          };
        })
      );
  
      res.json({ results: formattedResults, location });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));