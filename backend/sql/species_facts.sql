-- Create enum for fact categories
CREATE TYPE fact_category AS ENUM (
    'habitat',
    'behavior',
    'diet',
    'reproduction',
    'conservation',
    'distribution',
    'physical_characteristics',
    'ecological_role',
    'human_use',
    'other'
);

-- Create table for species facts
CREATE TABLE species_facts (
    id SERIAL PRIMARY KEY,
    species_id VARCHAR(255) REFERENCES species(composite_key),
    category fact_category NOT NULL,
    fact TEXT NOT NULL,
    source_reference TEXT, -- Scientific reference or source
    created_by INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INTEGER REFERENCES users(id),
    CONSTRAINT valid_fact CHECK (length(fact) >= 10)  -- Ensure minimal fact length
);

-- Create table for facts modification history
CREATE TABLE species_facts_history (
    id SERIAL PRIMARY KEY,
    fact_id INTEGER REFERENCES species_facts(id),
    modified_by INTEGER REFERENCES users(id),
    modification_type VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
    old_content TEXT,
    new_content TEXT,
    old_category fact_category,
    new_category fact_category,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reason TEXT -- Optional reason for modification
);

-- Create indexes
CREATE INDEX idx_species_facts_species ON species_facts(species_id);
CREATE INDEX idx_species_facts_category ON species_facts(category);
CREATE INDEX idx_species_facts_creator ON species_facts(created_by);

-- Create trigger function to update timestamp
CREATE OR REPLACE FUNCTION update_species_facts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for timestamp update
CREATE TRIGGER update_species_facts_timestamp
    BEFORE UPDATE ON species_facts
    FOR EACH ROW
    EXECUTE FUNCTION update_species_facts_timestamp();

-- Create trigger function to log facts changes
CREATE OR REPLACE FUNCTION log_species_facts_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO species_facts_history (
            fact_id, modified_by, modification_type,
            new_content, new_category
        ) VALUES (
            NEW.id, NEW.created_by, 'create',
            NEW.fact, NEW.category
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO species_facts_history (
            fact_id, modified_by, modification_type,
            old_content, new_content,
            old_category, new_category
        ) VALUES (
            NEW.id, NEW.last_modified_by, 'update',
            OLD.fact, NEW.fact,
            OLD.category, NEW.category
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO species_facts_history (
            fact_id, modified_by, modification_type,
            old_content, old_category
        ) VALUES (
            OLD.id, OLD.last_modified_by, 'delete',
            OLD.fact, OLD.category
        );
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for facts history
CREATE TRIGGER log_species_facts_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON species_facts
    FOR EACH ROW
    EXECUTE FUNCTION log_species_facts_changes();

-- Add comments
COMMENT ON TABLE species_facts IS 'Stores verified scientific facts about species';
COMMENT ON TABLE species_facts_history IS 'Tracks all modifications to species facts for auditing';