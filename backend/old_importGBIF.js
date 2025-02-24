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

// Define the taxonomic structure we want to fetch
const targetTaxonomy = [
  { kingdom: "Plantae", classes: [] }, // All plant classes
  { 
    kingdom: "Animalia", 
    classes: ["Mammalia", "Reptilia", "Insecta", "Aves", "Amphibia", "Actinopterygii", "Chondrichthyes"]
  },
  { 
    kingdom: "Mollusca", 
    classes: ["Gastropoda"]
  }
];

const countries = ["KE", "RW", "UG", "TZ", "BI"]; // East African countries

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

async function fetchAndSaveTaxonomy() {
  logger.info('Starting taxonomy fetch process');
  const taxonomyKeys = {};

  for (const group of targetTaxonomy) {
    try {
      // Fetch and save kingdom
      const kingdomData = await fetchTaxonKey(group.kingdom, 'KINGDOM');
      const kingdomKey = await saveTaxonKey(kingdomData);
      taxonomyKeys[group.kingdom] = { key: kingdomKey, classes: {} };

      // Fetch and save classes for this kingdom
      for (const className of group.classes) {
        try {
          const classData = await fetchTaxonKey(className, 'CLASS', kingdomKey);
          const classKey = await saveTaxonKey(classData);
          taxonomyKeys[group.kingdom].classes[className] = classKey;
          
          logger.info(`Saved class ${className} with key ${classKey}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        } catch (error) {
          logger.error(`Failed to fetch class ${className}: ${error.message}`);
        }
      }

      logger.info(`Saved kingdom ${group.kingdom} with key ${kingdomKey}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
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

async function importSpeciesToDB(speciesData, kingdomKey, classKey = null) {
  if (!speciesData || !speciesData.results || speciesData.results.length === 0) {
    return 0;
  }

  const values = speciesData.results.map(species => [
    `${species.key}_${kingdomKey}_${classKey || 'no_class'}`,
    species.key,
    species.canonicalName,
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
    species.nomenclaturalStatus
  ]);

  const query = `
    INSERT INTO species (
      composite_key,
      gbif_key,
      scientific_name,
      kingdom,
      kingdom_key,
      phylum,
      phylum_key,
      class,
      class_key,
      order_name,
      order_key,
      family,
      family_key,
      genus,
      genus_key,
      specific_epithet,
      taxonomic_status,
      nomenclatural_status
    )
    VALUES ${values.map((_, i) => `($${i * 18 + 1}, $${i * 18 + 2}, $${i * 18 + 3}, $${i * 18 + 4}, $${i * 18 + 5}, $${i * 18 + 6}, $${i * 18 + 7}, $${i * 18 + 8}, $${i * 18 + 9}, $${i * 18 + 10}, $${i * 18 + 11}, $${i * 18 + 12}, $${i * 18 + 13}, $${i * 18 + 14}, $${i * 18 + 15}, $${i * 18 + 16}, $${i * 18 + 17}, $${i * 18 + 18})`).join(', ')}
    ON CONFLICT (composite_key) DO UPDATE SET
      scientific_name = EXCLUDED.scientific_name,
      kingdom = EXCLUDED.kingdom,
      kingdom_key = EXCLUDED.kingdom_key,
      phylum = EXCLUDED.phylum,
      phylum_key = EXCLUDED.phylum_key,
      class = EXCLUDED.class,
      class_key = EXCLUDED.class_key,
      order_name = EXCLUDED.order_name,
      order_key = EXCLUDED.order_key,
      family = EXCLUDED.family,
      family_key = EXCLUDED.family_key,
      genus = EXCLUDED.genus,
      genus_key = EXCLUDED.genus_key,
      specific_epithet = EXCLUDED.specific_epithet,
      taxonomic_status = EXCLUDED.taxonomic_status,
      nomenclatural_status = EXCLUDED.nomenclatural_status;
  `;

  await client.query(query, values.flat());
  return values.length;
}

async function importAllData() {
  const startTime = new Date();
  let totalSpeciesImported = 0;

  try {
    await client.connect();
    logger.info('Connected to database');

    // First, fetch and save all taxonomy keys
    const taxonomyKeys = await fetchAndSaveTaxonomy();
    logger.info('Taxonomy hierarchy fetched and saved');

    // Then fetch and save species for each taxonomic group
    for (const group of targetTaxonomy) {
      const kingdomInfo = taxonomyKeys[group.kingdom];
      if (!kingdomInfo) continue;

      // If no specific classes are defined, fetch species for the whole kingdom
      if (group.classes.length === 0) {
        logger.info(`Fetching species for kingdom ${group.kingdom}`);
        const speciesData = await fetchSpecies(kingdomInfo.key);
        const importedCount = await importSpeciesToDB(speciesData, kingdomInfo.key);
        totalSpeciesImported += importedCount;
        logger.info(`Imported ${importedCount} species for kingdom ${group.kingdom}`);
      } else {
        // Fetch species for each class
        for (const className of group.classes) {
          const classKey = kingdomInfo.classes[className];
          if (!classKey) continue;

          logger.info(`Fetching species for class ${className}`);
          const speciesData = await fetchSpecies(classKey);
          const importedCount = await importSpeciesToDB(speciesData, kingdomInfo.key, classKey);
          totalSpeciesImported += importedCount;
          logger.info(`Imported ${importedCount} species for class ${className}`);
          
          await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
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