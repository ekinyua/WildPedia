const pool = require('../models/db');
const logger = require('../logger');

const adminDashboardController = {
    // Get user growth statistics
    async getUserStats(req, res) {
        try {
            // Get total user count
            const totalUsersResult = await pool.query(
                'SELECT COUNT(*) as total FROM users'
            );

            // Get new users by day for the last 30 days
            const userGrowthResult = await pool.query(
                `SELECT 
           DATE(created_at) as date,
           COUNT(*) as new_users
         FROM users
         WHERE created_at > NOW() - INTERVAL '30 days'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
            );

            // Get user role distribution
            const roleDistributionResult = await pool.query(
                `SELECT 
           role,
           COUNT(*) as count
         FROM users
         GROUP BY role`
            );

            res.json({
                totalUsers: totalUsersResult.rows[0].total,
                userGrowth: userGrowthResult.rows,
                roleDistribution: roleDistributionResult.rows
            });
        } catch (error) {
            logger.error(`Error fetching user statistics: ${error.message}`);
            res.status(500).json({
                message: "Error fetching user statistics",
                error: error.message
            });
        }
    },

    async listUsers(req, res) {
        try {
            const { query = '', limit = 10, offset = 0 } = req.query;

            let sqlQuery, countQuery, queryParams = [], countParams = [];

            if (query) {
                sqlQuery = `
              SELECT u.*, p.full_name, p.location, p.organization, p.expertise_area
              FROM users u
              LEFT JOIN user_profiles p ON u.id = p.user_id
              WHERE u.username ILIKE $1 OR u.email ILIKE $1
              ORDER BY u.created_at DESC
              LIMIT $2 OFFSET $3
            `;
                queryParams = [`%${query}%`, limit, offset];

                countQuery = `
              SELECT COUNT(*) as total
              FROM users
              WHERE username ILIKE $1 OR email ILIKE $1
            `;
                countParams = [`%${query}%`];
            } else {
                sqlQuery = `
              SELECT u.*, p.full_name, p.location, p.organization, p.expertise_area
              FROM users u
              LEFT JOIN user_profiles p ON u.id = p.user_id
              ORDER BY u.created_at DESC
              LIMIT $1 OFFSET $2
            `;
                queryParams = [limit, offset];

                countQuery = `
              SELECT COUNT(*) as total
              FROM users
            `;
            }

            const [usersResult, countResult] = await Promise.all([
                pool.query(sqlQuery, queryParams),
                pool.query(countQuery, countParams)
            ]);

            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);

            res.json({
                users: usersResult.rows,
                total,
                totalPages
            });
        } catch (error) {
            logger.error(`Error listing users: ${error.message}`);
            res.status(500).json({
                message: "Error listing users",
                error: error.message
            });
        }
    },

    // Update user active status
    async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { isActive } = req.body;

            // Prevent self-deactivation
            if (parseInt(userId) === req.user.id) {
                return res.status(403).json({
                    message: "You cannot change your own status"
                });
            }

            const result = await pool.query(
                `UPDATE users
             SET is_active = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, username, email, role, is_active`,
                [isActive, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            logger.info(`User ${userId} status updated to ${isActive ? 'active' : 'disabled'} by admin ${req.user.id}`);

            res.json({
                message: `User ${isActive ? 'enabled' : 'disabled'} successfully`,
                user: result.rows[0]
            });
        } catch (error) {
            logger.error(`Error updating user status: ${error.message}`);
            res.status(500).json({
                message: "Error updating user status",
                error: error.message
            });
        }
    },

    // Get content statistics
    async getContentStats(req, res) {
        try {
            // Get count by content type
            const contentTypeResult = await pool.query(
                `SELECT 
           content_type,
           COUNT(*) as count
         FROM cultural_content
         GROUP BY content_type`
            );

            // Get count by status
            const statusCountResult = await pool.query(
                `SELECT 
           status,
           COUNT(*) as count
         FROM cultural_content
         GROUP BY status`
            );

            // Get content submission trends (last 30 days)
            const submissionTrendsResult = await pool.query(
                `SELECT 
           DATE(created_at) as date,
           COUNT(*) as submissions
         FROM cultural_content
         WHERE created_at > NOW() - INTERVAL '30 days'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
            );

            res.json({
                contentTypeDistribution: contentTypeResult.rows,
                statusDistribution: statusCountResult.rows,
                submissionTrends: submissionTrendsResult.rows
            });
        } catch (error) {
            logger.error(`Error fetching content statistics: ${error.message}`);
            res.status(500).json({
                message: "Error fetching content statistics",
                error: error.message
            });
        }
    },

    // Get species statistics
    async getSpeciesStats(req, res) {
        try {
            // Get count by kingdom
            const kingdomResult = await pool.query(
                `SELECT 
           kingdom,
           COUNT(*) as count
         FROM species
         GROUP BY kingdom`
            );

            // Get count by class
            const classResult = await pool.query(
                `SELECT 
           class,
           COUNT(*) as count
         FROM species
         GROUP BY class
         ORDER BY count DESC
         LIMIT 10`
            );

            res.json({
                kingdomDistribution: kingdomResult.rows,
                topClasses: classResult.rows
            });
        } catch (error) {
            logger.error(`Error fetching species statistics: ${error.message}`);
            res.status(500).json({
                message: "Error fetching species statistics",
                error: error.message
            });
        }
    },

    // Get dashboard summary (all key metrics in one call)
    async getDashboardSummary(req, res) {
        try {
            // Users summary
            const userSummaryResult = await pool.query(
                `SELECT 
           COUNT(*) as total_users,
           COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
           COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_users_week
         FROM users`
            );

            // Content summary
            const contentSummaryResult = await pool.query(
                `SELECT 
           COUNT(*) as total_content,
           COUNT(*) FILTER (WHERE status = 'pending') as pending_moderation,
           COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_content_week
         FROM cultural_content`
            );

            // Species summary
            const speciesSummaryResult = await pool.query(
                'SELECT COUNT(*) as total_species FROM species'
            );

            // View summary
            const viewSummaryResult = await pool.query(
                `SELECT 
           COUNT(*) as total_views,
           COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days') as views_this_week
         FROM species_views`
            );

            res.json({
                users: userSummaryResult.rows[0],
                content: contentSummaryResult.rows[0],
                species: speciesSummaryResult.rows[0],
                views: viewSummaryResult.rows[0]
            });
        } catch (error) {
            logger.error(`Error fetching dashboard summary: ${error.message}`);
            res.status(500).json({
                message: "Error fetching dashboard summary",
                error: error.message
            });
        }
    }
};

module.exports = adminDashboardController;