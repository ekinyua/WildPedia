-- Set the search path
SET search_path TO public;

-- First, check if the columns exist and add them if they don't
DO $$
DECLARE
    column_added BOOLEAN := FALSE;
BEGIN
    -- Check and add sound_url column if needed
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name='species' AND column_name='sound_url'
    ) THEN
        ALTER TABLE species ADD COLUMN sound_url VARCHAR(500);
        RAISE NOTICE 'Added sound_url column to species table';
        column_added := TRUE;
    END IF;

    -- Check and add location column if needed
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name='species' AND column_name='location'
    ) THEN
        ALTER TABLE species ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column to species table';
        column_added := TRUE;
    END IF;

    -- Check and add kiswahili_name column if needed
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name='species' AND column_name='kiswahili_name'
    ) THEN
        ALTER TABLE species ADD COLUMN kiswahili_name VARCHAR(255);
        RAISE NOTICE 'Added kiswahili_name column to species table';
        column_added := TRUE;
    END IF;

    -- Check and add kinyarwanda_name column if needed
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name='species' AND column_name='kinyarwanda_name'
    ) THEN
        ALTER TABLE species ADD COLUMN kinyarwanda_name VARCHAR(255);
        RAISE NOTICE 'Added kinyarwanda_name column to species table';
        column_added := TRUE;
    END IF;

    IF column_added THEN
        RAISE NOTICE 'Added one or more columns to the species table';
    ELSE
        RAISE NOTICE 'All required columns already exist in the species table';
    END IF;
END
$$;

-- Now update all species information in a single transaction
BEGIN;

-- Update sound URLs
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/buffalo-syncerus-caffer.mp3' WHERE scientific_name = 'Syncerus caffer';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/baboon-papio-anubis.mp3' WHERE scientific_name = 'Papio anubis';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/gorilla-gorilla-beringei.mp3' WHERE scientific_name = 'Gorilla gorilla';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/gorilla-gorilla-beringei.mp3' WHERE scientific_name = 'Gorilla beringei';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/chimpanzee-pan-troglodytes.mp3' WHERE scientific_name = 'Pan paniscus';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/porcupine-hystrix-cristata.mp3' WHERE scientific_name = 'Hystrix cristata';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/giraffe-giraffa+camelopardalis.mp3' WHERE scientific_name = 'Giraffa camelopardalis';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/cheetah-acinonyx-jubatus.mp3' WHERE scientific_name = 'Acinonyx jubatus';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/leopard-panthera-pardus.mp3' WHERE scientific_name = 'Panthera pardus';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/lion-panthera-leo.mp3' WHERE scientific_name = 'Panthera leo';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/elephant-loxodonta-africana.mp3' WHERE scientific_name = 'Loxodonta africana';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/elephant-loxodonta-africana.mp3' WHERE scientific_name = 'Loxodonta cyclotis';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/wildebeest-connochaetes-taurinus.mp3' WHERE scientific_name = 'Connochaetes taurinus';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/hippopotamus-hippopotamus-amphibius.mp3' WHERE scientific_name = 'Hippopotamus amphibius';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/hyena-crocuta-crocuta.mp3' WHERE scientific_name = 'Crocuta crocuta';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/rhinoceros-ceratotherium-simum.mp3' WHERE scientific_name = 'Ceratotherium simum';
UPDATE species SET sound_url = 'https://wildpedis-animal-sound.s3.us-east-1.amazonaws.com/animal_sound_dataset/rhinoceros-diceros-bicornis.mp3' WHERE scientific_name = 'Diceros bicornis';

-- Update locations
UPDATE species SET location = 'Volcanoes National Park (Rwanda), Bwindi Impenetrable National Park (Uganda), Mgahinga Gorilla National Park (Uganda)' WHERE scientific_name = 'Gorilla beringei';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Lake Manyara National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)' WHERE scientific_name = 'Panthera leo';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Murchison Falls National Park (Uganda), Queen Elizabeth National Park (Uganda)' WHERE scientific_name = 'Loxodonta africana';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Lake Nakuru National Park (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)' WHERE scientific_name = 'Syncerus caffer';
UPDATE species SET location = 'Nairobi National Park (Kenya), Samburu National Reserve (Kenya), Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Murchison Falls National Park (Uganda), Lake Mburo National Park (Uganda)' WHERE scientific_name = 'Giraffa camelopardalis';
UPDATE species SET location = 'Bwindi Impenetrable National Park (Uganda), Kibale National Park (Uganda), Nyungwe Forest National Park (Rwanda), Selous Game Reserve (Tanzania), Kakamega Forest (Kenya)' WHERE scientific_name = 'Smutsia gigantea';
UPDATE species SET location = 'Virunga National Park (DRC)' WHERE scientific_name = 'Gorilla gorilla';
UPDATE species SET location = 'Virunga National Park (DRC)' WHERE scientific_name = 'Pan paniscus';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Laikipia Plateau (Kenya), Serengeti National Park (Tanzania), Ruaha National Park (Tanzania), Kidepo Valley National Park (Uganda)' WHERE scientific_name = 'Lycaon pictus';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda)' WHERE scientific_name = 'Hystrix cristata';
UPDATE species SET location = 'Kibale National Park (Uganda), Budongo Forest Reserve (Uganda), Gombe Stream National Park (Tanzania), Mahale Mountains National Park (Tanzania), Nyungwe Forest National Park (Rwanda)' WHERE scientific_name = 'Pan troglodytes';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Kidepo Valley National Park (Uganda)' WHERE scientific_name = 'Acinonyx jubatus';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Samburu National Reserve (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)' WHERE scientific_name = 'Panthera pardus';
UPDATE species SET location = 'Not found in East Africa (primarily in Central and West Africa)' WHERE scientific_name = 'Loxodonta cyclotis';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Serengeti National Park (Tanzania)' WHERE scientific_name = 'Connochaetes taurinus';
UPDATE species SET location = 'Lake Nakuru National Park (Kenya), Maasai Mara National Reserve (Kenya), Serengeti National Park (Tanzania), Lake Manyara National Park (Tanzania), Akagera National Park (Rwanda), Murchison Falls National Park (Uganda), Queen Elizabeth National Park (Uganda)' WHERE scientific_name = 'Hippopotamus amphibius';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Serengeti National Park (Tanzania), Ngorongoro Conservation Area (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda)' WHERE scientific_name = 'Crocuta crocuta';
UPDATE species SET location = 'Lake Nakuru National Park (Kenya), Ol Pejeta Conservancy (Kenya), Ziwa Rhino Sanctuary (Uganda), Akagera National Park (Rwanda)' WHERE scientific_name = 'Ceratotherium simum';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Tsavo National Park (Kenya), Lake Nakuru National Park (Kenya), Ol Pejeta Conservancy (Kenya), Ngorongoro Conservation Area (Tanzania), Serengeti National Park (Tanzania), Akagera National Park (Rwanda)' WHERE scientific_name = 'Diceros bicornis';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Lake Nakuru National Park (Kenya), Serengeti National Park (Tanzania), Lake Manyara National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)' WHERE scientific_name = 'Papio anubis';
UPDATE species SET location = 'Maasai Mara National Reserve (Kenya), Amboseli National Park (Kenya), Serengeti National Park (Tanzania), Tarangire National Park (Tanzania), Akagera National Park (Rwanda), Queen Elizabeth National Park (Uganda), Murchison Falls National Park (Uganda)' WHERE scientific_name = 'Kobus ellipsiprymnus';

-- Update local names
UPDATE species SET kiswahili_name = 'Kakakuona', kinyarwanda_name = 'Urusimba' WHERE scientific_name = 'Smutsia gigantea';
UPDATE species SET kiswahili_name = 'Sokwe Mtu', kinyarwanda_name = 'Ingagi' WHERE scientific_name = 'Gorilla gorilla';
UPDATE species SET kiswahili_name = 'Sokwe Mfupi', kinyarwanda_name = 'Impundu' WHERE scientific_name = 'Pan paniscus';
UPDATE species SET kiswahili_name = 'Sokwe Mlima', kinyarwanda_name = 'Ingagi y''Imisozi' WHERE scientific_name = 'Gorilla beringei';
UPDATE species SET kiswahili_name = 'Mbwa Mwitu', kinyarwanda_name = 'Imbwa y''Ishyamba' WHERE scientific_name = 'Lycaon pictus';
UPDATE species SET kiswahili_name = 'Nungunungu', kinyarwanda_name = 'Ikinyogote' WHERE scientific_name = 'Hystrix cristata';
UPDATE species SET kiswahili_name = 'Twiga', kinyarwanda_name = 'Twiga' WHERE scientific_name = 'Giraffa camelopardalis';
UPDATE species SET kiswahili_name = 'Sokwe', kinyarwanda_name = 'Impundu' WHERE scientific_name = 'Pan troglodytes';
UPDATE species SET kiswahili_name = 'Duma', kinyarwanda_name = 'Ingwe' WHERE scientific_name = 'Acinonyx jubatus';
UPDATE species SET kiswahili_name = 'Chui', kinyarwanda_name = 'Ingwe' WHERE scientific_name = 'Panthera pardus';
UPDATE species SET kiswahili_name = 'Simba', kinyarwanda_name = 'Intare' WHERE scientific_name = 'Panthera leo';
UPDATE species SET kiswahili_name = 'Ndovu', kinyarwanda_name = 'Inzovu' WHERE scientific_name = 'Loxodonta africana';
UPDATE species SET kiswahili_name = 'Ndovu wa Msitu', kinyarwanda_name = 'Inzovu y''Ishyamba' WHERE scientific_name = 'Loxodonta cyclotis';
UPDATE species SET kiswahili_name = 'Nyumbu', kinyarwanda_name = 'Inyumbu' WHERE scientific_name = 'Connochaetes taurinus';
UPDATE species SET kiswahili_name = 'Nyati', kinyarwanda_name = 'Imbogo' WHERE scientific_name = 'Syncerus caffer';
UPDATE species SET kiswahili_name = 'Kiboko', kinyarwanda_name = 'Imvubu' WHERE scientific_name = 'Hippopotamus amphibius';
UPDATE species SET kiswahili_name = 'Fisi', kinyarwanda_name = 'Imfyisi' WHERE scientific_name = 'Crocuta crocuta';
UPDATE species SET kiswahili_name = 'Kifaru Mweupe', kinyarwanda_name = 'Inkura y''Umweru' WHERE scientific_name = 'Ceratotherium simum';
UPDATE species SET kiswahili_name = 'Kifaru Mweusi', kinyarwanda_name = 'Inkura y''Umukara' WHERE scientific_name = 'Diceros bicornis';
UPDATE species SET kiswahili_name = 'Nyani', kinyarwanda_name = 'Inkende' WHERE scientific_name = 'Papio anubis';
UPDATE species SET kiswahili_name = 'Kuro', kinyarwanda_name = 'Inyange' WHERE scientific_name = 'Kobus ellipsiprymnus';
UPDATE species SET kiswahili_name = 'Mbwa', kinyarwanda_name = 'Imbwa' WHERE scientific_name = 'Canis familiaris';

COMMIT;

-- Verify the updates and provide a summary
SELECT 
    COUNT(*) AS total_species,
    COUNT(sound_url) AS species_with_sounds,
    COUNT(location) AS species_with_locations,
    COUNT(kiswahili_name) AS species_with_kiswahili_names,
    COUNT(kinyarwanda_name) AS species_with_kinyarwanda_names
FROM species;

-- Show detailed information for each species
SELECT 
    id, 
    scientific_name, 
    CASE WHEN sound_url IS NOT NULL THEN 'Yes' ELSE 'No' END AS has_sound,
    CASE WHEN location IS NOT NULL THEN 'Yes' ELSE 'No' END AS has_location,
    kiswahili_name, 
    kinyarwanda_name
FROM species 
ORDER BY id;