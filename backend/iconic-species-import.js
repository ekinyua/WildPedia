// iconic-species-import.js
require('dotenv').config();
const { Client } = require('pg');
const fetch = require('node-fetch');
const logger = require('./logger');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Iconic East African species with their GBIF keys
const iconicSpecies = [
    { name: "Panthera leo", commonName: "Lion", gbifKey: 5219404 },
    { name: "Gorilla beringei", commonName: "Eastern Gorilla", gbifKey: 2436435 },
    { name: "Loxodonta africana", commonName: "African Elephant", gbifKey: 5231190 },
    { name: "Giraffa camelopardalis", commonName: "Giraffe", gbifKey: 5220156 },
    { name: "Syncerus caffer", commonName: "African Buffalo", gbifKey: 2441022 },
    { name: "Hippopotamus amphibius", commonName: "Hippopotamus", gbifKey: 2440899 },
    { name: "Diceros bicornis", commonName: "Black Rhinoceros", gbifKey: 2440909 },
    { name: "Acinonyx jubatus", commonName: "Cheetah", gbifKey: 5219441 },
    { name: "Crocodylus niloticus", commonName: "Nile Crocodile", gbifKey: 5223361 },
    { name: "Equus quagga", commonName: "Plains Zebra", gbifKey: 2440965 },
    { name: "Panthera pardus", commonName: "Leopard", gbifKey: 5219437 },
    { name: "Ceratotherium simum", commonName: "White Rhinoceros", gbifKey: 2440974 },
    { name: "Connochaetes taurinus", commonName: "Blue Wildebeest", gbifKey: 2441011 },
    { name: "Papio anubis", commonName: "Olive Baboon", gbifKey: 2436456 },
    { name: "Crocuta crocuta", commonName: "Spotted Hyena", gbifKey: 5219233 },
    { name: "Cercopithecus mitis", commonName: "Blue Monkey", gbifKey: 2436990 },
    { name: "Tragelaphus strepsiceros", commonName: "Greater Kudu", gbifKey: 5220440 },
    { name: "Taurotragus oryx", commonName: "Common Eland", gbifKey: 2441174 },
    { name: "Hyaena hyaena", commonName: "Striped Hyena", gbifKey: 5219227 },
    { name: "Kobus ellipsiprymnus", commonName: "Waterbuck", gbifKey: 2441070 },
    { name: "Oreotragus oreotragus", commonName: "Klipspringer", gbifKey: 2441044 },
    { name: "Canis mesomelas", commonName: "Black-backed Jackal", gbifKey: 5219242 },
    { name: "Tragelaphus scriptus", commonName: "Bushbuck", gbifKey: 5220438 },
    { name: "Phacochoerus africanus", commonName: "Common Warthog", gbifKey: 2441201 },
    { name: "Aepyceros melampus", commonName: "Impala", gbifKey: 2441210 },
    { name: "Naja haje", commonName: "Egyptian Cobra", gbifKey: 5225402 },
    { name: "Python sebae", commonName: "African Rock Python", gbifKey: 5224441 },
    { name: "Leptailurus serval", commonName: "Serval", gbifKey: 5219400 },
    { name: "Bucorvus leadbeateri", commonName: "Southern Ground Hornbill", gbifKey: 2474783 },
    { name: "Balearica regulorum", commonName: "Grey Crowned Crane", gbifKey: 2474859 },
    { name: "Dendroaspis polylepis", commonName: "Black Mamba", gbifKey: 5225426 },
    { name: "Sagittarius serpentarius", commonName: "Secretary Bird", gbifKey: 2480591 },
    { name: "Gyps africanus", commonName: "White-backed Vulture", gbifKey: 2480640 },
    { name: "Terathopius ecaudatus", commonName: "Bateleur Eagle", gbifKey: 2480632 },
    { name: "Mungos mungo", commonName: "Banded Mongoose", gbifKey: 5219251 },
    { name: "Madoqua kirkii", commonName: "Kirk's Dik-dik", gbifKey: 2441048 },
    { name: "Colobus guereza", commonName: "Mantled Guereza", gbifKey: 2436995 },
    { name: "Orycteropus afer", commonName: "Aardvark", gbifKey: 2437959 },
    { name: "Mellivora capensis", commonName: "Honey Badger", gbifKey: 5219212 },
    { name: "Otocyon megalotis", commonName: "Bat-eared Fox", gbifKey: 5219238 },
    { name: "Taurotragus derbianus", commonName: "Giant Eland", gbifKey: 2441175 },
    { name: "Manis temminckii", commonName: "Ground Pangolin", gbifKey: 2433101 },
    { name: "Civettictis civetta", commonName: "African Civet", gbifKey: 2434229 },
    { name: "Lycaon pictus", commonName: "African Wild Dog", gbifKey: 5219158 },
    { name: "Litocranius walleri", commonName: "Gerenuk", gbifKey: 2441191 },
    { name: "Damaliscus lunatus", commonName: "Topi", gbifKey: 2441197 },
    { name: "Numida meleagris", commonName: "Helmeted Guineafowl", gbifKey: 2474654 },
    { name: "Varanus niloticus", commonName: "Nile Monitor", gbifKey: 2468992 },
    { name: "Trigonoceps occipitalis", commonName: "White-headed Vulture", gbifKey: 2480661 },
    { name: "Aquila rapax", commonName: "Tawny Eagle", gbifKey: 5228673 }
];

// Helper function to retry fetches if they fail
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

async function fetchSpeciesData(gbifKey) {
    try {
        const url = `https://api.gbif.org/v1/species/${gbifKey}`;
        return await fetchWithRetry(url);
    } catch (error) {
        logger.error(`Error fetching species data for ${gbifKey}: ${error.message}`);
        return null;
    }
}

async function fetchSpeciesMedia(gbifKey) {
    try {
        const url = `https://api.gbif.org/v1/species/${gbifKey}/media`;
        return await fetchWithRetry(url);
    } catch (error) {
        logger.error(`Error fetching media for ${gbifKey}: ${error.message}`);
        return { results: [] };
    }
}

// Function to ensure taxonomic keys exist in the database
async function ensureTaxonomicKeysExist(speciesData) {
    try {
        // Insert Kingdom key if it doesn't exist
        if (speciesData.kingdomKey) {
            await client.query(`
        INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
        VALUES ($1, 'KINGDOM', $2, NULL)
        ON CONFLICT (taxon_key) DO NOTHING
      `, [speciesData.kingdom || 'Unknown Kingdom', speciesData.kingdomKey]);
        }

        // Insert Phylum key if it doesn't exist
        if (speciesData.phylumKey) {
            await client.query(`
        INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
        VALUES ($1, 'PHYLUM', $2, $3)
        ON CONFLICT (taxon_key) DO NOTHING
      `, [
                speciesData.phylum || 'Unknown Phylum',
                speciesData.phylumKey,
                speciesData.kingdomKey || null
            ]);
        }

        // Insert Class key if it doesn't exist
        if (speciesData.classKey) {
            await client.query(`
        INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
        VALUES ($1, 'CLASS', $2, $3)
        ON CONFLICT (taxon_key) DO NOTHING
      `, [
                speciesData.class || 'Unknown Class',
                speciesData.classKey,
                speciesData.phylumKey || null
            ]);
        }

        // Insert Order key if it doesn't exist
        if (speciesData.orderKey) {
            await client.query(`
        INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
        VALUES ($1, 'ORDER', $2, $3)
        ON CONFLICT (taxon_key) DO NOTHING
      `, [
                speciesData.order || 'Unknown Order',
                speciesData.orderKey,
                speciesData.classKey || null
            ]);
        }

        // Insert Family key if it doesn't exist
        if (speciesData.familyKey) {
            await client.query(`
        INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
        VALUES ($1, 'FAMILY', $2, $3)
        ON CONFLICT (taxon_key) DO NOTHING
      `, [
                speciesData.family || 'Unknown Family',
                speciesData.familyKey,
                speciesData.orderKey || null
            ]);
        }

        // Insert Genus key if it doesn't exist
        if (speciesData.genusKey) {
            await client.query(`
        INSERT INTO taxonomic_keys (name, rank, taxon_key, parent_key)
        VALUES ($1, 'GENUS', $2, $3)
        ON CONFLICT (taxon_key) DO NOTHING
      `, [
                speciesData.genus || 'Unknown Genus',
                speciesData.genusKey,
                speciesData.familyKey || null
            ]);
        }

        logger.info(`Ensured taxonomic keys exist for ${speciesData.scientificName}`);
    } catch (error) {
        logger.error(`Error ensuring taxonomic keys: ${error.message}`);
        throw error;
    }
}

async function importIconicSpecies() {
    await client.connect();

    try {
        // Begin transaction to ensure data consistency
        await client.query('BEGIN');

        for (const species of iconicSpecies) {
            try {
                // Check if species already exists
                const existingCheck = await client.query(
                    'SELECT composite_key FROM species WHERE gbif_key = $1',
                    [species.gbifKey]
                );

                if (existingCheck.rows.length > 0) {
                    logger.info(`Species ${species.name} already exists, skipping.`);
                    continue;
                }

                // Fetch detailed data from GBIF
                const speciesData = await fetchSpeciesData(species.gbifKey);
                if (!speciesData) {
                    logger.warn(`Could not fetch data for ${species.name}, skipping.`);
                    continue;
                }

                // IMPORTANT: First ensure all taxonomic keys exist
                await ensureTaxonomicKeysExist(speciesData);

                // Fetch media data
                const mediaData = await fetchSpeciesMedia(species.gbifKey);
                const image_url = mediaData.results && mediaData.results.length > 0
                    ? mediaData.results[0].identifier
                    : null;

                // Prepare vernacular names
                let vernacularNames = [species.commonName];
                if (speciesData.vernacularNames) {
                    const englishNames = speciesData.vernacularNames
                        .filter(vn => vn.language === 'eng')
                        .map(vn => vn.vernacularName);

                    // Add additional English names not already included
                    englishNames.forEach(name => {
                        if (!vernacularNames.includes(name)) {
                            vernacularNames.push(name);
                        }
                    });
                }

                // Create composite key
                const kingdomKey = speciesData.kingdomKey || 1;
                const classKey = speciesData.classKey || null;
                const compositeKey = `${species.gbifKey}_${kingdomKey}_${classKey || 'null'}`;

                // Insert species into database
                await client.query(`
          INSERT INTO species (
            composite_key, gbif_key, scientific_name, vernacular_names,
            kingdom, kingdom_key, phylum, phylum_key, class, class_key,
            order_name, order_key, family, family_key, genus, genus_key,
            taxonomic_status, image_url, image_source
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (composite_key) DO UPDATE SET
            scientific_name = EXCLUDED.scientific_name,
            vernacular_names = EXCLUDED.vernacular_names,
            image_url = EXCLUDED.image_url,
            last_modified = CURRENT_TIMESTAMP
        `, [
                    compositeKey,
                    species.gbifKey,
                    speciesData.scientificName || species.name,
                    vernacularNames,
                    speciesData.kingdom,
                    speciesData.kingdomKey,
                    speciesData.phylum,
                    speciesData.phylumKey,
                    speciesData.class,
                    speciesData.classKey,
                    speciesData.order,
                    speciesData.orderKey,
                    speciesData.family,
                    speciesData.familyKey,
                    speciesData.genus,
                    speciesData.genusKey,
                    speciesData.taxonomicStatus || 'ACCEPTED',
                    image_url,
                    image_url ? 'GBIF' : null
                ]);

                logger.info(`Successfully imported ${species.name} (${species.commonName})`);
            } catch (speciesError) {
                // Log the error but continue with other species
                logger.error(`Error importing species ${species.name}: ${speciesError.message}`);
            }
        }

        // Commit the transaction
        await client.query('COMMIT');
        logger.info('Iconic species import completed');
    } catch (error) {
        // Rollback the transaction in case of error
        await client.query('ROLLBACK');
        logger.error(`Error importing iconic species: ${error.message}`);
        throw error;
    } finally {
        await client.end();
    }
}

// Run the import
importIconicSpecies().catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
});