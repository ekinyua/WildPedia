-- Create enum for content types
CREATE TYPE content_type AS ENUM ('myth', 'legend', 'proverb');

-- Create enum for content status
CREATE TYPE content_status AS ENUM ('pending', 'approved', 'rejected', 'archived');

-- Create enum for content languages
CREATE TYPE content_language AS ENUM ('en', 'rw', 'sw');

-- Create table for cultural content
CREATE TABLE cultural_content (
    id SERIAL PRIMARY KEY,
    species_id VARCHAR(255) REFERENCES species(composite_key),
    content_type content_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    language content_language NOT NULL DEFAULT 'en',
    source VARCHAR(255), -- Optional attribution/reference
    author_id INTEGER REFERENCES users(id) NOT NULL,
    status content_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INTEGER REFERENCES users(id),
    CONSTRAINT valid_content CHECK (length(content) >= 10)  -- Ensure minimal content length
);

-- Create table for content modification history
CREATE TABLE cultural_content_history (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES cultural_content(id),
    modified_by INTEGER REFERENCES users(id),
    modification_type VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete', 'status_change'
    old_status content_status,
    new_status content_status,
    old_content TEXT,
    new_content TEXT,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reason TEXT -- Optional reason for modification
);

-- Create indexes
CREATE INDEX idx_cultural_content_species ON cultural_content(species_id);
CREATE INDEX idx_cultural_content_author ON cultural_content(author_id);
CREATE INDEX idx_cultural_content_status ON cultural_content(status);
CREATE INDEX idx_cultural_content_type ON cultural_content(content_type);
CREATE INDEX idx_cultural_content_language ON cultural_content(language);

-- Create trigger function to update timestamp
CREATE OR REPLACE FUNCTION update_cultural_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for timestamp update
CREATE TRIGGER update_cultural_content_timestamp
    BEFORE UPDATE ON cultural_content
    FOR EACH ROW
    EXECUTE FUNCTION update_cultural_content_timestamp();

-- Create trigger function to log content changes
CREATE OR REPLACE FUNCTION log_cultural_content_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO cultural_content_history (
            content_id, modified_by, modification_type,
            new_status, new_content
        ) VALUES (
            NEW.id, NEW.author_id, 'create',
            NEW.status, NEW.content
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO cultural_content_history (
            content_id, modified_by, modification_type,
            old_status, new_status,
            old_content, new_content
        ) VALUES (
            NEW.id, NEW.last_modified_by,
            CASE 
                WHEN NEW.status != OLD.status THEN 'status_change'
                ELSE 'update'
            END,
            OLD.status, NEW.status,
            OLD.content, NEW.content
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO cultural_content_history (
            content_id, modified_by, modification_type,
            old_status, old_content
        ) VALUES (
            OLD.id, OLD.last_modified_by, 'delete',
            OLD.status, OLD.content
        );
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for content history
CREATE TRIGGER log_cultural_content_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON cultural_content
    FOR EACH ROW
    EXECUTE FUNCTION log_cultural_content_changes();

-- Add comments
COMMENT ON TABLE cultural_content IS 'Stores cultural content (myths, legends, proverbs) related to species';
COMMENT ON TABLE cultural_content_history IS 'Tracks all modifications to cultural content for auditing';