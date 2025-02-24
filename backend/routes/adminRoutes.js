const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create species
router.post("/", async (req, res) => {
  const { gbif_key, scientific_name, common_name, description, image_url } = req.body;
  try {
    await pool.query(
      'INSERT INTO species (gbif_key, scientific_name, common_name, description, image_url) VALUES ($1, $2, $3, $4, $5)',
      [gbif_key, scientific_name, common_name, description, image_url]
    );
    res.status(201).json({ message: "Species added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update species
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { common_name, description, image_url } = req.body;
  try {
    await pool.query(
      'UPDATE species SET common_name = $1, description = $2, image_url = $3 WHERE gbif_key = $4',
      [common_name, description, image_url, id]
    );
    res.json({ message: "Species updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all species
router.get("/", async (req, res) => {
  try {
    const species = await pool.query('SELECT * FROM species');
    res.json(species.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;