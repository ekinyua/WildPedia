const pool = require('./models/db');

// Mapping scientific names to location information
const locationMap = {
    'Gorilla beringei': 'Volcanoes National Park (Rwanda), Virunga National Park (DRC)',
    'Panthera leo': 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya)',
    'Loxodonta africana': 'Amboseli National Park (Kenya), Tsavo East & West (Kenya)',
    'Syncerus caffer': 'Akagera National Park (Rwanda), Lake Nakuru National Park (Kenya)',
    'Giraffa camelopardalis': 'Nairobi National Park (Kenya), Samburu National Reserve (Kenya)',

    'Smutsia gigantea': 'Bwindi Impenetrable National Park (Uganda), Kibale National Park (Uganda), Nyungwe Forest National Park (Rwanda), Selous Game Reserve (Tanzania), Kakamega Forest (Kenya)',
    'Gorilla gorilla': 'Virunga National Park (DRC)',
    'Pan paniscus': 'Virunga National Park (DRC)',
    'Gorilla beringei': 'Volcanoes National Park (Rwanda), Bwindi Impenetrable National Park (Uganda), Mgahinga Gorilla National Park (Uganda)',
    'Lycaon pictus': 'Maasai Mara National Reserve (Kenya), Laikipia Plateau (Kenya), Serengeti National Park (Tanzania), Ruaha National Park (Tanzania), Kidepo Valley National Park (Uganda)',
    'Hystrix cristata': 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda)',
    'Giraffa camelopardalis': 'Nairobi National Park (Kenya), Samburu National Reserve (Kenya), Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Murchison Falls National Park (Uganda), Lake Mburo National Park (Uganda)',
    'Pan troglodytes': 'Kibale National Park (Uganda), Budongo Forest Reserve (Uganda), Gombe Stream National Park (Tanzania), Mahale Mountains National Park (Tanzania), Nyungwe Forest National Park (Rwanda)',
    'Acinonyx jubatus': 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Kidepo Valley National Park (Uganda)',
    'Panthera pardus': 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Samburu National Reserve (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)',
    'Panthera leo': 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Lake Manyara National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)',
    'Loxodonta africana': 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Murchison Falls National Park (Uganda), Queen Elizabeth National Park (Uganda)',
    'Loxodonta cyclotis': 'Not found in East Africa (primarily in Central and West Africa)',
    'Connochaetes taurinus': 'Maasai Mara National Reserve (Kenya), Serengeti National Park (Tanzania)',
    'Syncerus caffer': 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Lake Nakuru National Park (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)',
    'Hippopotamus amphibius': 'Lake Nakuru National Park (Kenya), Maasai Mara National Reserve (Kenya), Serengeti National Park (Tanzania), Lake Manyara National Park (Tanzania), Akagera National Park (Rwanda), Murchison Falls National Park (Uganda), Queen Elizabeth National Park (Uganda)',
    'Crocuta crocuta': 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda)',
    'Ceratotherium simum': 'Lake Nakuru National Park (Kenya), Ol Pejeta Conservancy (Kenya), Ziwa Rhino Sanctuary (Uganda), Akagera National Park (Rwanda)',
    'Diceros bicornis': 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Lake Nakuru National Park (Kenya), Ol Pejeta Conservancy (Kenya), Ngorongoro Conservation Area (Tanzania), Serengeti National Park (Tanzania), Akagera National Park (Rwanda)',
    'Papio anubis': 'Maasai Mara National Reserve (Kenya), Lake Nakuru National Park (Kenya), Serengeti National Park (Tanzania), Lake Manyara National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)',
    'Kobus ellipsiprymnus': 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)',
};

async function updateSpeciesLocations() {
    for (const [scientificName, location] of Object.entries(locationMap)) {
        await pool.query(
            'UPDATE species SET location = $1 WHERE scientific_name = $2',
            [location, scientificName]
        );
        console.log(`Updated location for ${scientificName}`);
    }
}

updateSpeciesLocations()
    .then(() => console.log('Species locations update complete'))
    .catch(err => console.error('Error:', err))
    .finally(() => pool.end());