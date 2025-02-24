require('dotenv').config();
const cors = require("cors");
const express = require('express');
const fetch = require('node-fetch');
const ipapi = require('ipapi.co');

const app = express();

app.use(cors());
app.use(express.json());

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

// Route to fetch species based on search query or user's location
app.get("/api/species", async (req, res) => {
  try {
    let location = req.query.location || 'Kigali'; // Default to Kigali if no location provided
    let apiUrl = `${GBIF_API_BASE_URL}/species/search?limit=12`;

    if (req.query.q) {
      apiUrl += `&q=${encodeURIComponent(req.query.q)}`;
    } else {
      // Fetch species based on user's location
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const geoData = await ipapi.location(ip);
      location = `${geoData.city}, ${geoData.country_name}`;
      apiUrl += `&country=${geoData.country_code}`;
    }

    const speciesData = await fetchFromGBIF(apiUrl);

    console.log('GBIF species data:', speciesData); // Debugging statement

    const results = await Promise.all(
      speciesData.results.map(async (rawSpecies) => {
        let image = null;
        let scientificName = rawSpecies.scientificName || '';

        // Clean scientific name for iNaturalist query
        const cleanName = cleanScientificName(scientificName);

        // First, try iNaturalist
        image = await fetchImagesFromINaturalist(cleanName);
        if (image) {
          console.log(`iNaturalist Image URL: ${image}`);
        } else {
          // Fallback to GBIF
          try {
            const mediaData = await fetchFromGBIF(
              `${GBIF_API_BASE_URL}/species/${rawSpecies.key}/media?limit=1`
            );
            console.log(`GBIF media data for ${scientificName}:`, mediaData); // Debugging statement
            if (mediaData.results.length > 0) {
              image = mediaData.results[0].identifier.replace(/^http:/i, 'https:');
              console.log(`GBIF Image URL: ${image}`);
            }
          } catch (error) {
            console.error(`Error fetching GBIF media for ${scientificName}:`, error);
          }
        }

        return {
          key: rawSpecies.key,
          scientificName: scientificName,
          genus: rawSpecies.genus || '',
          species: rawSpecies.species || '',
          rank: rawSpecies.rank,
          kingdom: rawSpecies.kingdom,
          phylum: rawSpecies.phylum,
          family: rawSpecies.family,
          image: image,
        };
      })
    );

    res.json({ results, location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));