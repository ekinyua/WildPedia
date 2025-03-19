const pool = require('./models/db');

// Mapping scientific names to S3 URLs
const soundMap = {
    'Syncerus caffer': 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/buffalo-syncerus-caffer.mp3',
    'Papio anubis': 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/baboon-papio-anubis.mp3',
    "Gorilla gorilla": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/gorilla-gorilla-beringei.mp3',
    "Gorilla beringei": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/gorilla-gorilla-beringei.mp3',
    "Pan paniscus": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/chimpanzee-pan-troglodytes.mp3',
    "Hystrix cristata": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/porcupine-hystrix-cristata.mp3',
    "Giraffa camelopardalis": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/giraffe-giraffa+camelopardalis.mp3',
    "Acinonyx jubatus": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/cheetah-acinonyx-jubatus.mp3',
    "Panthera pardus": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/leopard-panthera-pardus.mp3',
    "Panthera leo": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/lion-panthera-leo.mp3',
    "Loxodonta africana": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/elephant-loxodonta-africana.mp3',
    "Loxodonta cyclotis": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/elephant-loxodonta-africana.mp3',
    "Connochaetes taurinus": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/wildebeest-connochaetes-taurinus.mp3',
    "Hippopotamus amphibius": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/hippopotamus-hippopotamus-amphibius.mp3',
    "Crocuta crocuta": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/hyena-crocuta-crocuta.mp3',
    "Ceratotherium simum": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/rhinoceros-ceratotherium-simum.mp3',
    "Diceros bicornis": 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/rhinoceros-diceros-bicornis.mp3',


};

async function updateSoundUrls() {
    for (const [scientificName, soundUrl] of Object.entries(soundMap)) {
        await pool.query(
            'UPDATE species SET sound_url = $1 WHERE scientific_name = $2',
            [soundUrl, scientificName]
        );
        console.log(`Updated sound for ${scientificName}`);
    }
}

updateSoundUrls()
    .then(() => console.log('Sound URL update complete'))
    .catch(err => console.error('Error:', err))
    .finally(() => pool.end());