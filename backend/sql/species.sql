CREATE TABLE taxonomic_keys (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    taxon_key INTEGER NOT NULL UNIQUE,
    parent_key INTEGER REFERENCES taxonomic_keys(taxon_key),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for species data
CREATE TABLE species (
    id SERIAL,
    composite_key VARCHAR(255) PRIMARY KEY,
    gbif_key INTEGER NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    vernacular_names TEXT[], -- Array of English common names
    kingdom VARCHAR(255),
    kingdom_key INTEGER,
    phylum VARCHAR(255),
    phylum_key INTEGER,
    class VARCHAR(255),
    class_key INTEGER,
    order_name VARCHAR(255),
    order_key INTEGER,
    family VARCHAR(255),
    family_key INTEGER,
    genus VARCHAR(255),
    genus_key INTEGER,
    specific_epithet VARCHAR(255),
    taxonomic_status VARCHAR(255),
    nomenclatural_status VARCHAR(255),
    habitat TEXT,
    threat_status VARCHAR(50),
    description TEXT, -- NEW: Added field for species description
    image_url TEXT,
    image_source VARCHAR(50), -- 'GBIF', 'iNaturalist', or 'user_uploaded'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kingdom_key) REFERENCES taxonomic_keys(taxon_key),
    FOREIGN KEY (class_key) REFERENCES taxonomic_keys(taxon_key)
);

-- Create indexes for better performance
CREATE INDEX idx_species_gbif_key ON species(gbif_key);
CREATE INDEX idx_species_scientific_name ON species(scientific_name);
CREATE INDEX idx_species_kingdom_class ON species(kingdom_key, class_key);
CREATE INDEX idx_taxonomic_keys_name ON taxonomic_keys(name);
CREATE INDEX idx_taxonomic_keys_rank ON taxonomic_keys(rank);