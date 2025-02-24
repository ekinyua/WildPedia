const pool = require('./db');
const logger = require('../logger');

const speciesFactsModel = {
  async create({ speciesId, category, fact, sourceReference, createdBy }) {
    try {
      const result = await pool.query(
        `INSERT INTO species_facts 
         (species_id, category, fact, source_reference, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [speciesId, category, fact, sourceReference, createdBy]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating species fact: ${error.message}`);
      throw error;
    }
  },

  async getBySpeciesId(speciesId) {
    try {
      const result = await pool.query(
        `SELECT sf.*, u.username as creator_name,
         (SELECT username FROM users WHERE id = sf.last_modified_by) as modifier_name
         FROM species_facts sf
         JOIN users u ON sf.created_by = u.id
         WHERE sf.species_id = $1
         ORDER BY sf.category, sf.created_at DESC`,
        [speciesId]
      );
      return result.rows;
    } catch (error) {
      logger.error(`Error fetching species facts: ${error.message}`);
      throw error;
    }
  },

  async getByCategory(speciesId, category) {
    try {
      const result = await pool.query(
        `SELECT sf.*, u.username as creator_name
         FROM species_facts sf
         JOIN users u ON sf.created_by = u.id
         WHERE sf.species_id = $1 AND sf.category = $2
         ORDER BY sf.created_at DESC`,
        [speciesId, category]
      );
      return result.rows;
    } catch (error) {
      logger.error(`Error fetching facts by category: ${error.message}`);
      throw error;
    }
  },

  async updateFact(factId, { category, fact, sourceReference }, modifierId) {
    try {
      const result = await pool.query(
        `UPDATE species_facts
         SET category = COALESCE($1, category),
             fact = COALESCE($2, fact),
             source_reference = COALESCE($3, source_reference),
             last_modified_by = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [category, fact, sourceReference, modifierId, factId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error updating species fact: ${error.message}`);
      throw error;
    }
  },

  async delete(factId, modifierId) {
    try {
      // First record the deletion in history
      await pool.query(
        `INSERT INTO species_facts_history 
         (fact_id, modified_by, modification_type, old_content, old_category)
         SELECT id, $2, 'delete', fact, category
         FROM species_facts
         WHERE id = $1`,
        [factId, modifierId]
      );

      // Then delete the fact
      const result = await pool.query(
        'DELETE FROM species_facts WHERE id = $1 RETURNING *',
        [factId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error deleting species fact: ${error.message}`);
      throw error;
    }
  },

  async getFactHistory(factId) {
    try {
      const result = await pool.query(
        `SELECT h.*, u.username as modifier_name
         FROM species_facts_history h
         JOIN users u ON h.modified_by = u.id
         WHERE h.fact_id = $1
         ORDER BY h.modified_at DESC`,
        [factId]
      );
      return result.rows;
    } catch (error) {
      logger.error(`Error fetching fact history: ${error.message}`);
      throw error;
    }
  },

  async searchFacts(searchTerm, limit = 10, offset = 0) {
    try {
      const result = await pool.query(
        `SELECT sf.*, u.username as creator_name, s.scientific_name
         FROM species_facts sf
         JOIN users u ON sf.created_by = u.id
         JOIN species s ON sf.species_id = s.composite_key
         WHERE sf.fact ILIKE $1 OR s.scientific_name ILIKE $1
         ORDER BY sf.created_at DESC
         LIMIT $2 OFFSET $3`,
        [`%${searchTerm}%`, limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error(`Error searching facts: ${error.message}`);
      throw error;
    }
  },

  async getFactsByUser(userId) {
    try {
      const result = await pool.query(
        `SELECT sf.*, s.scientific_name
         FROM species_facts sf
         JOIN species s ON sf.species_id = s.composite_key
         WHERE sf.created_by = $1
         ORDER BY sf.created_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      logger.error(`Error fetching user facts: ${error.message}`);
      throw error;
    }
  }
};

module.exports = speciesFactsModel;