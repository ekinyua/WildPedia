const pool = require('./models/db');

// Mapping scientific names to Kiswahili and Kinyarwanda names
const localizedNames = {
    "Smutsia gigantea": {
        kiswahili: "Kakakuona",
        kinyarwanda: "Urusimba"
    },
    "Gorilla gorilla": {
        kiswahili: "Sokwe Mtu",
        kinyarwanda: "Ingagi"
    },
    "Pan paniscus": {
        kiswahili: "Sokwe Mfupi",
        kinyarwanda: "Impundu"
    },
    "Gorilla beringei": {
        kiswahili: "Sokwe Mlima",
        kinyarwanda: "Ingagi y'Imisozi"
    },
    "Lycaon pictus": {
        kiswahili: "Mbwa Mwitu",
        kinyarwanda: "Imbwa y'Ishyamba"
    },
    "Hystrix cristata": {
        kiswahili: "Nungunungu",
        kinyarwanda: "Ikinyogote"
    },
    "Giraffa camelopardalis": {
        kiswahili: "Twiga",
        kinyarwanda: "Twiga"
    },
    "Pan troglodytes": {
        kiswahili: "Sokwe",
        kinyarwanda: "Impundu"
    },
    "Acinonyx jubatus": {
        kiswahili: "Duma",
        kinyarwanda: "Ingwe"
    },
    "Panthera pardus": {
        kiswahili: "Chui",
        kinyarwanda: "Ingwe"
    },
    "Panthera leo": {
        kiswahili: "Simba",
        kinyarwanda: "Intare"
    },
    "Loxodonta africana": {
        kiswahili: "Ndovu",
        kinyarwanda: "Inzovu"
    },
    "Loxodonta cyclotis": {
        kiswahili: "Ndovu wa Msitu",
        kinyarwanda: "Inzovu y'Ishyamba"
    },
    "Connochaetes taurinus": {
        kiswahili: "Nyumbu",
        kinyarwanda: "Inyumbu"
    },
    "Syncerus caffer": {
        kiswahili: "Nyati",
        kinyarwanda: "Imbogo"
    },
    "Hippopotamus amphibius": {
        kiswahili: "Kiboko",
        kinyarwanda: "Imvubu"
    },
    "Crocuta crocuta": {
        kiswahili: "Fisi",
        kinyarwanda: "Imfyisi"
    },
    "Ceratotherium simum": {
        kiswahili: "Kifaru Mweupe",
        kinyarwanda: "Inkura y'Umweru"
    },
    "Diceros bicornis": {
        kiswahili: "Kifaru Mweusi",
        kinyarwanda: "Inkura y'Umukara"
    },
    "Papio anubis": {
        kiswahili: "Nyani",
        kinyarwanda: "Inkende"
    },
    "Kobus ellipsiprymnus": {
        kiswahili: "Kuro",
        kinyarwanda: "Inyange"
    },
    "Canis familiaris": {
        kiswahili: "Mbwa",
        kinyarwanda: "Imbwa"
    }
};

async function updateLocalizedNames() {
    try {
        console.log('Starting update of localized species names...');
        let successCount = 0;
        let notFoundCount = 0;

        for (const [scientificName, names] of Object.entries(localizedNames)) {
            try {
                // Check if the species exists first
                const checkResult = await pool.query(
                    'SELECT composite_key FROM species WHERE scientific_name = $1',
                    [scientificName]
                );

                if (checkResult.rows.length === 0) {
                    console.log(`Species not found: ${scientificName}`);
                    notFoundCount++;
                    continue;
                }

                // Update the species with localized names
                await pool.query(
                    'UPDATE species SET kiswahili_name = $1, kinyarwanda_name = $2 WHERE scientific_name = $3',
                    [names.kiswahili, names.kinyarwanda, scientificName]
                );

                console.log(`✓ Updated localized names for ${scientificName}`);
                successCount++;
            } catch (speciesError) {
                console.error(`Error updating ${scientificName}:`, speciesError.message);
            }
        }

        console.log(`\nLocalized names update complete!`);
        console.log(`Successfully updated: ${successCount} species`);
        console.log(`Species not found: ${notFoundCount} species`);
    } catch (error) {
        console.error('Error in update process:', error);
    } finally {
        pool.end();
    }
}

// Run the update function
updateLocalizedNames();