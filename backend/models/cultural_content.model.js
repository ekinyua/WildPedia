const pool = require('./db');
const logger = require('../logger');

const culturalContentModel = {
    async create({ speciesId, contentType, title, content, language, source, authorId }) {
        try {
            const result = await pool.query(
                `INSERT INTO cultural_content 
                 (species_id, content_type, title, content, language, source, author_id, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'approved')
                 RETURNING *`,
                [speciesId, contentType, title, content, language, source, authorId]
            );
            return result.rows[0];
        } catch (error) {
            logger.error(`Error creating cultural content: ${error.message}`);
            throw error;
        }
    },

    async getBySpeciesId(speciesId, language = 'en', userId = null) {
        try {
            const result = await pool.query(
                `SELECT cc.*, u.username as author_name,
             (SELECT username FROM users WHERE id = cc.last_modified_by) as modifier_name,
             (SELECT vote_direction FROM cultural_content_votes 
              WHERE content_id = cc.id AND user_id = $3) as user_vote_direction
             FROM cultural_content cc
             JOIN users u ON cc.author_id = u.id
             WHERE cc.species_id = $1 
             AND cc.language = $2 
             ORDER BY (cc.upvotes - cc.downvotes) DESC, cc.created_at DESC`,
                [speciesId, language, userId]
            );
            return result.rows;
        } catch (error) {
            logger.error(`Error fetching cultural content: ${error.message}`);
            throw error;
        }
    },

    async getContentForModeration(status = 'pending', limit = 10, offset = 0) {
        try {
            const result = await pool.query(
                `SELECT cc.*, u.username as author_name
         FROM cultural_content cc
         JOIN users u ON cc.author_id = u.id
         WHERE cc.status = $1
         ORDER BY cc.created_at ASC
         LIMIT $2 OFFSET $3`,
                [status, limit, offset]
            );
            return result.rows;
        } catch (error) {
            logger.error(`Error fetching content for moderation: ${error.message}`);
            throw error;
        }
    },

    async updateContent(contentId, { title, content, source }, modifierId) {
        try {
            const result = await pool.query(
                `UPDATE cultural_content
         SET title = COALESCE($1, title),
             content = COALESCE($2, content),
             source = COALESCE($3, source),
             last_modified_by = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
                [title, content, source, modifierId, contentId]
            );
            return result.rows[0];
        } catch (error) {
            logger.error(`Error updating cultural content: ${error.message}`);
            throw error;
        }
    },

    async updateStatus(contentId, status, modifierId) {
        try {
            const result = await pool.query(
                `UPDATE cultural_content
         SET status = $1,
             last_modified_by = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
                [status, modifierId, contentId]
            );
            return result.rows[0];
        } catch (error) {
            logger.error(`Error updating content status: ${error.message}`);
            throw error;
        }
    },

    async delete(contentId, modifierId) {
        try {
            // First record the deletion in history
            await pool.query(
                `INSERT INTO cultural_content_history 
         (content_id, modified_by, modification_type, old_status, old_content)
         SELECT id, $2, 'delete', status, content
         FROM cultural_content
         WHERE id = $1`,
                [contentId, modifierId]
            );

            // Then delete the content
            const result = await pool.query(
                'DELETE FROM cultural_content WHERE id = $1 RETURNING *',
                [contentId]
            );
            return result.rows[0];
        } catch (error) {
            logger.error(`Error deleting cultural content: ${error.message}`);
            throw error;
        }
    },

    async getContentHistory(contentId) {
        try {
            const result = await pool.query(
                `SELECT h.*, u.username as modifier_name
         FROM cultural_content_history h
         JOIN users u ON h.modified_by = u.id
         WHERE h.content_id = $1
         ORDER BY h.modified_at DESC`,
                [contentId]
            );
            return result.rows;
        } catch (error) {
            logger.error(`Error fetching content history: ${error.message}`);
            throw error;
        }
    },

    async getUserContent(userId, status = null) {
        try {
            const query = status
                ? `SELECT * FROM cultural_content WHERE author_id = $1 AND status = $2 ORDER BY created_at DESC`
                : `SELECT * FROM cultural_content WHERE author_id = $1 ORDER BY created_at DESC`;

            const values = status ? [userId, status] : [userId];
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            logger.error(`Error fetching user content: ${error.message}`);
            throw error;
        }
    }
};

module.exports = culturalContentModel;