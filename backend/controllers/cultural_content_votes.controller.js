const pool = require('../models/db');
const logger = require('../logger');

const contentVotesController = {
    async voteForContent(req, res) {
        try {
            const { contentId } = req.params;
            const { direction = 'up' } = req.body; // Default to upvote
            const userId = req.user.id;

            if (!['up', 'down'].includes(direction)) {
                return res.status(400).json({
                    message: "Direction must be 'up' or 'down'"
                });
            }

            // Begin transaction
            await pool.query('BEGIN');

            // Check if user has already voted for this content
            const checkResult = await pool.query(
                'SELECT id, vote_direction FROM cultural_content_votes WHERE content_id = $1 AND user_id = $2',
                [contentId, userId]
            );

            if (checkResult.rows.length > 0) {
                const existingVote = checkResult.rows[0];
                const existingDirection = existingVote.vote_direction;

                // If same direction, remove the vote (toggle behavior)
                if (existingDirection === direction) {
                    // Remove the vote
                    await pool.query(
                        'DELETE FROM cultural_content_votes WHERE id = $1',
                        [existingVote.id]
                    );

                    // Decrement the appropriate counter, ensuring it doesn't go below 0
                    await pool.query(
                        `UPDATE cultural_content 
             SET ${direction === 'up' ? 'upvotes' : 'downvotes'} = 
                GREATEST(${direction === 'up' ? 'upvotes' : 'downvotes'} - 1, 0)
             WHERE id = $1`,
                        [contentId]
                    );
                } else {
                    // Change vote direction
                    await pool.query(
                        'UPDATE cultural_content_votes SET vote_direction = $1 WHERE id = $2',
                        [direction, existingVote.id]
                    );

                    // Update both counters in a single query, ensuring decrements don't go below 0
                    await pool.query(
                        `UPDATE cultural_content 
             SET upvotes = CASE 
                             WHEN $2 = 'up' THEN GREATEST(upvotes - 1, 0)
                             WHEN $3 = 'up' THEN upvotes + 1
                             ELSE upvotes
                           END,
                 downvotes = CASE
                               WHEN $2 = 'down' THEN GREATEST(downvotes - 1, 0)
                               WHEN $3 = 'down' THEN downvotes + 1
                               ELSE downvotes
                             END
             WHERE id = $1`,
                        [contentId, existingDirection, direction]
                    );
                }
            } else {
                // New vote
                await pool.query(
                    'INSERT INTO cultural_content_votes (content_id, user_id, vote_direction) VALUES ($1, $2, $3)',
                    [contentId, userId, direction]
                );

                // Increment the appropriate counter
                await pool.query(
                    `UPDATE cultural_content 
           SET ${direction === 'up' ? 'upvotes' : 'downvotes'} = 
              ${direction === 'up' ? 'upvotes' : 'downvotes'} + 1 
           WHERE id = $1`,
                    [contentId]
                );
            }

            // Get updated content
            const result = await pool.query(
                `SELECT cc.*, 
         (SELECT vote_direction FROM cultural_content_votes 
          WHERE content_id = cc.id AND user_id = $2) as user_vote_direction
         FROM cultural_content cc
         WHERE cc.id = $1`,
                [contentId, userId]
            );

            await pool.query('COMMIT');

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Content not found"
                });
            }

            logger.info(`User ${userId} ${direction}voted for cultural content ${contentId}`);

            res.json({
                message: "Vote recorded successfully",
                content: result.rows[0]
            });
        } catch (error) {
            await pool.query('ROLLBACK');
            logger.error(`Error recording vote: ${error.message}`);
            res.status(500).json({
                message: "Error recording vote",
                error: error.message
            });
        }
    }
};

module.exports = contentVotesController;