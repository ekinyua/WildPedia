CREATE TABLE cultural_content_votes (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES cultural_content(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_id, user_id)
);

-- Index for faster lookups
CREATE INDEX idx_content_votes_user ON cultural_content_votes(user_id);
CREATE INDEX idx_content_votes_content ON cultural_content_votes(content_id);