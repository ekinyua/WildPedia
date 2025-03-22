const pool = require('../models/db');
const logger = require('../logger');

const moderationController = {
    // Get content pending moderation with filtering
    async getModerationQueue(req, res) {
        try {
            const {
                status = 'pending',
                contentType,
                language,
                limit = 10,
                offset = 0,
                sortBy = 'created_at',
                sortDir = 'ASC'
            } = req.query;

            // Build query with filters
            let query = `
        SELECT cc.*, u.username as author_name
        FROM cultural_content cc
        JOIN users u ON cc.author_id = u.id
        WHERE cc.status = $1
      `;

            const queryParams = [status];
            let paramCounter = 2;

            if (contentType) {
                query += ` AND cc.content_type = $${paramCounter}`;
                queryParams.push(contentType);
                paramCounter++;
            }

            if (language) {
                query += ` AND cc.language = $${paramCounter}`;
                queryParams.push(language);
                paramCounter++;
            }

            // Add sorting
            query += ` ORDER BY cc.${sortBy} ${sortDir}`;

            // Add pagination
            query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
            queryParams.push(limit, offset);

            const result = await pool.query(query, queryParams);

            // Get total count for pagination
            const countQuery = `
        SELECT COUNT(*) as total
        FROM cultural_content cc
        WHERE cc.status = $1
        ${contentType ? ' AND cc.content_type = $2' : ''}
        ${language ? ` AND cc.language = $${contentType ? 3 : 2}` : ''}
      `;

            const countQueryParams = [status];
            if (contentType) countQueryParams.push(contentType);
            if (language) countQueryParams.push(language);

            const countResult = await pool.query(countQuery, countQueryParams);

            res.json({
                content: result.rows,
                total: parseInt(countResult.rows[0].total),
                page: Math.floor(offset / limit) + 1,
                pageSize: limit,
                totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
            });

        } catch (error) {
            logger.error(`Error fetching moderation queue: ${error.message}`);
            res.status(500).json({
                message: "Error fetching moderation queue",
                error: error.message
            });
        }
    },

    // Approve or reject content
    async moderateContent(req, res) {
        try {
            const { contentId } = req.params;
            const { status, reason } = req.body;
            const modifierId = req.user.id;

            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    message: "Status must be 'approved' or 'rejected'"
                });
            }

            // Start transaction
            await pool.query('BEGIN');

            // Update content status
            const contentResult = await pool.query(
                `UPDATE cultural_content
         SET status = $1,
             last_modified_by = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
                [status, modifierId, contentId]
            );

            if (contentResult.rows.length === 0) {
                await pool.query('ROLLBACK');
                return res.status(404).json({
                    message: "Content not found"
                });
            }

            // Record in history table
            await pool.query(
                `INSERT INTO cultural_content_history
         (content_id, modified_by, modification_type, old_status, new_status, reason, modified_at)
         VALUES ($1, $2, 'status_change', 'pending', $3, $4, CURRENT_TIMESTAMP)`,
                [contentId, modifierId, status, reason || null]
            );

            await pool.query('COMMIT');

            logger.info(`Content ID ${contentId} ${status} by moderator ${modifierId}`);

            res.json({
                message: `Content ${status} successfully`,
                content: contentResult.rows[0]
            });

        } catch (error) {
            await pool.query('ROLLBACK');
            logger.error(`Error moderating content: ${error.message}`);
            res.status(500).json({
                message: "Error moderating content",
                error: error.message
            });
        }
    },

    // Bulk moderate content
    async bulkModerateContent(req, res) {
        try {
            const { contentIds, status, reason } = req.body;
            const modifierId = req.user.id;

            if (!Array.isArray(contentIds) || contentIds.length === 0) {
                return res.status(400).json({
                    message: "Content IDs array is required"
                });
            }

            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    message: "Status must be 'approved' or 'rejected'"
                });
            }

            // Start transaction
            await pool.query('BEGIN');

            // Update all content items
            const updateResult = await pool.query(
                `UPDATE cultural_content
         SET status = $1,
             last_modified_by = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ANY($3)
         RETURNING id`,
                [status, modifierId, contentIds]
            );

            // Record in history table for each item
            for (const row of updateResult.rows) {
                await pool.query(
                    `INSERT INTO cultural_content_history
           (content_id, modified_by, modification_type, old_status, new_status, reason, modified_at)
           VALUES ($1, $2, 'status_change', 'pending', $3, $4, CURRENT_TIMESTAMP)`,
                    [row.id, modifierId, status, reason || null]
                );
            }

            await pool.query('COMMIT');

            logger.info(`Bulk moderation: ${updateResult.rows.length} items ${status} by moderator ${modifierId}`);

            res.json({
                message: `${updateResult.rows.length} items ${status} successfully`,
                modifiedCount: updateResult.rows.length
            });

        } catch (error) {
            await pool.query('ROLLBACK');
            logger.error(`Error in bulk moderation: ${error.message}`);
            res.status(500).json({
                message: "Error performing bulk moderation",
                error: error.message
            });
        }
    }
};

module.exports = moderationController;