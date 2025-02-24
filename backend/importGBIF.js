const { Client } = require('pg');
require('dotenv').config();
const fetch = require('node-fetch');
const logger = require('./logger');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Define target taxonomy groups
const targetTaxonomy = [
  { kingdom: "Plantae", classes: [] },
  { 
    kingdom: "Animalia", 
    classes: ["Mammalia", "Reptilia", "Insecta", "Aves", "Amphibia", "Actinopterygii", "Chondrichthyes"]
  },
  { 
    kingdom: "Mollusca", 
    classes: ["Gastropoda"]
  }
];

const countries = ["KE", "RW", "UG", "TZ", "BI"];

const GBIF_API_BASE_URL = "https://api.gbif.org/v1";
const INATURALIST_API_BASE_URL = "https://api.inaturalist.org/v1";

async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        const waitTime = (i + 1) * 2000;
        logger.warn(`Rate limit hit, waiting ${waitTime}ms before retry ${i + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      logger.warn(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Max retries reached');
}

async function fetchTaxonKey(name, rank, parentKey = null) {
  const base = "https://api.gbif.org/v1/species/match";
  const params = new URLSearchParams({
    name: name,
    rank: rank,
    strict: "true",
    verbose: "true"
  });

  const data = await fetchWithRetry(`${base}?${params.toString()}`);
  
  if (!data.matchType || data.matchType === 'NONE') {
    throw new Error(`No match found for ${rank} ${name}`);
  }

  return {
    key: data.usageKey,
    name: data.scientificName,
    rank: data.rank,
    parentKey: parentKey
  };
}

async function saveTaxonKey(taxonData) {
  const query = `
    INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (taxon_key) DO UPDATE SET
      name = EXCLUDED.name,
      rank = EXCLUDED.rank,
      parent_key = EXCLUDED.parent_key
    RETURNING taxon_key;
  `;

  const result = await client.query(query, [
    taxonData.name,
    taxonData.rank,
    taxonData.key,
    taxonData.parentKey
  ]);

  return result.rows[0].taxon_key;
}

// NEW: Modified to include descriptions field from GBIF API response
async function fetchSpeciesData(speciesKey) {
  const url = `${GBIF_API_BASE_URL}/species/${speciesKey}`;
  const data = await fetchWithRetry(url);
  
  // Extract vernacular names
  const vernacularNames = data.vernacularNames ? 
    data.vernacularNames
      .filter(vn => vn.language === 'eng')
      .map(vn => vn.vernacularName) : 
    [];

  // NEW: Get first description if available, otherwise null
  // This allows admin to add description later through frontend if none exists
  const description = data.descriptions && data.descriptions.length > 0 ? 
    data.descriptions[0] : 
    null;

  return { 
    ...data, 
    vernacularNames,
    description  // NEW: Include description in returned data
  };
}

async function fetchSpeciesMedia(speciesKey) {
  const url = `${GBIF_API_BASE_URL}/species/${speciesKey}/media`;
  return await fetchWithRetry(url);
}

async function fetchImagesFromINaturalist(scientificName) {
  try {
    const url = `${INATURALIST_API_BASE_URL}/search?q=${encodeURIComponent(scientificName)}`;
    const data = await fetchWithRetry(url);
    if (data.results && data.results.length > 0 && data.results[0].record.default_photo) {
      return {
        url: data.results[0].record.default_photo.medium_url,
        source: 'iNaturalist'
      };
    }
  } catch (error) {
    logger.warn(`iNaturalist fetch error for ${scientificName}: ${error.message}`);
  }
  return null;
}

async function importSpeciesToDB(speciesData, kingdomKey, classKey = null) {
  if (!speciesData || !speciesData.results || speciesData.results.length === 0) {
    return 0;
  }

  let importedCount = 0;

  for (const species of speciesData.results) {
    try {
      const detailedData = await fetchSpeciesData(species.key);
      const mediaData = await fetchSpeciesMedia(species.key);

      let image_url = null;
      let image_source = null;
      if (mediaData.results && mediaData.results.length > 0) {
        image_url = mediaData.results[0].identifier;
        image_source = "GBIF";
      } else {
        const inatImage = await fetchImagesFromINaturalist(species.canonicalName);
        if (inatImage) {
          image_url = inatImage.url;
          image_source = inatImage.source;
        }
      }

      const values = [
        `${species.key}_${kingdomKey}_${classKey || 'no_class'}`,
        species.key,
        species.canonicalName,
        detailedData.vernacularNames,
        species.kingdom,
        kingdomKey,
        species.phylum,
        species.phylumKey,
        species.class,
        classKey,
        species.order,
        species.orderKey,
        species.family,
        species.familyKey,
        species.genus,
        species.genusKey,
        species.specificEpithet,
        species.taxonomicStatus,
        species.nomenclaturalStatus,
        detailedData.habitat || null,
        detailedData.threatStatus || null,
        detailedData.description, // NEW: Added description to values array
        image_url,
        image_source
      ];

      const query = `
        INSERT INTO species (
          composite_key, gbif_key, scientific_name, vernacular_names,
          kingdom, kingdom_key, phylum, phylum_key, class, class_key,
          order_name, order_key, family, family_key, genus, genus_key,
          specific_epithet, taxonomic_status, nomenclatural_status,
          habitat, threat_status, description, image_url, image_source
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
                $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        ON CONFLICT (composite_key) DO UPDATE SET
          scientific_name = EXCLUDED.scientific_name,
          vernacular_names = EXCLUDED.vernacular_names,
          kingdom = EXCLUDED.kingdom,
          phylum = EXCLUDED.phylum,
          class = EXCLUDED.class,
          order_name = EXCLUDED.order_name,
          family = EXCLUDED.family,
          genus = EXCLUDED.genus,
          specific_epithet = EXCLUDED.specific_epithet,
          taxonomic_status = EXCLUDED.taxonomic_status,
          nomenclatural_status = EXCLUDED.nomenclatural_status,
          habitat = EXCLUDED.habitat,
          threat_status = EXCLUDED.threat_status,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          image_source = EXCLUDED.image_source,
          last_modified = CURRENT_TIMESTAMP;
      `;

      await client.query(query, values);
      importedCount++;
      logger.info(`Imported species: ${species.canonicalName}`);
    } catch (error) {
      logger.error(`Error importing species ${species.key}: ${error.message}`);
    }
  }

  return importedCount;
}

async function fetchAndSaveTaxonomy() {
  logger.info('Starting taxonomy fetch process');
  const taxonomyKeys = {};

  for (const group of targetTaxonomy) {
    try {
      const kingdomData = await fetchTaxonKey(group.kingdom, 'KINGDOM');
      const kingdomKey = await saveTaxonKey(kingdomData);
      taxonomyKeys[group.kingdom] = { key: kingdomKey, classes: {} };

      for (const className of group.classes) {
        try {
          const classData = await fetchTaxonKey(className, 'CLASS', kingdomKey);
          const classKey = await saveTaxonKey(classData);
          taxonomyKeys[group.kingdom].classes[className] = classKey;
          
          logger.info(`Saved class ${className} with key ${classKey}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          logger.error(`Failed to fetch class ${className}: ${error.message}`);
        }
      }

      logger.info(`Saved kingdom ${group.kingdom} with key ${kingdomKey}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error(`Failed to fetch kingdom ${group.kingdom}: ${error.message}`);
    }
  }

  return taxonomyKeys;
}

async function fetchSpecies(taxonKey, limit = 10) {
  const base = "https://api.gbif.org/v1/species/search";
  const params = new URLSearchParams({
    rank: "SPECIES",
    status: "ACCEPTED",
    higherTaxonKey: taxonKey.toString(),
    country: countries.join(','),
    limit: limit.toString(),
    facet: "kingdom,class",
    hasCoordinate: "true"
  });

  return await fetchWithRetry(`${base}?${params.toString()}`);
}

async function importAllData() {
  const startTime = new Date();
  let totalSpeciesImported = 0;

  try {
    await client.connect();
    logger.info('Connected to database');

    const taxonomyKeys = await fetchAndSaveTaxonomy();
    logger.info('Taxonomy hierarchy fetched and saved');

    for (const group of targetTaxonomy) {
      const kingdomInfo = taxonomyKeys[group.kingdom];
      if (!kingdomInfo) continue;

      if (group.classes.length === 0) {
        logger.info(`Fetching species for kingdom ${group.kingdom}`);
        const speciesData = await fetchSpecies(kingdomInfo.key);
        const importedCount = await importSpeciesToDB(speciesData, kingdomInfo.key);
        totalSpeciesImported += importedCount;
        logger.info(`Imported ${importedCount} species for kingdom ${group.kingdom}`);
      } else {
        for (const className of group.classes) {
          const classKey = kingdomInfo.classes[className];
          if (!classKey) continue;

          logger.info(`Fetching species for class ${className}`);
          const speciesData = await fetchSpecies(classKey);
          const importedCount = await importSpeciesToDB(speciesData, kingdomInfo.key, classKey);
          totalSpeciesImported += importedCount;
          logger.info(`Imported ${importedCount} species for class ${className}`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    logger.info(`Import completed. Total species imported: ${totalSpeciesImported}`);
    logger.info(`Total execution time: ${duration} seconds`);

  } catch (error) {
    logger.error(`Import failed: ${error.message}`);
    throw error;
  } finally {
    await client.end();
    logger.info('Database connection closed');
  }
}


// Execute the import
importAllData()
  .catch(error => {
    logger.error(`Application failed: ${error.message}`);
    process.exit(1);
  });