require('dotenv').config();
const cors = require("cors");
const axios = require("axios");
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const GBIF_API_BASE_URL = "https://api.gbif.org/v1";

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


// Route to fetch species based on search query
app.get("/api/species", async (req, res) => {
  try {
    const query = req.query.q;
    let apiUrl = `${GBIF_API_BASE_URL}/species/search?limit=12`;

    if (query && query !== "random") {
      apiUrl += `&q=${query}`;
    }

    const data = await fetchFromGBIF(apiUrl);
    // const data = await fetchFromGBIF(`${GBIF_API_BASE_URL}/species/search?q=${query}&limit=10`);
    
    // Fetch first image for each species
    const results = await Promise.all(
      data.results.map(async (species) => {
        try {
          const imageData = await fetchFromGBIF(
            `${GBIF_API_BASE_URL}/occurrence/search?taxonKey=${species.key}&mediaType=StillImage&limit=1`
          );
          return {
            ...species,
            image: imageData.results[0]?.media?.[0]?.identifier || null
          };
        } catch (error) {
          return { ...species, image: null };
        }
      })
    );

    res.json({ results });
    // res.json({ ...data, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))