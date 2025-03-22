const pool = require('../models/db');
const logger = require('../logger');

const recordSpeciesView = async (req, res) => {
    try {
        const { speciesId } = req.params;

        // Get user ID if authenticated
        const userId = req.user?.id || null;

        // Check all possible sources for sessionId with proper error handling
        let sessionId = null;
        if (req.cookies) sessionId = req.cookies.sessionId;
        if (!sessionId && req.headers) sessionId = req.headers['x-session-id'];
        if (!sessionId && req.body) sessionId = req.body.sessionId;

        // Get IP address with fallbacks
        const ipAddress = req.ip || (req.headers ? req.headers['x-forwarded-for'] : null) || null;

        console.log('Debug analytics:', {
            speciesId,
            userId,
            sessionId,
            ipAddress,
            bodyReceived: !!req.body,
            headersReceived: !!req.headers,
            cookiesReceived: !!req.cookies
        });

        // Insert into database with error handling around each field
        await pool.query(
            `INSERT INTO species_views 
             (species_id, user_id, session_id, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [speciesId, userId, sessionId, ipAddress]
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(`Error recording species view:`, error);
        // Return 200 even on error to not disrupt user experience
        res.status(200).json({ success: false });
    }
};

const analyticsController = {
    // Record a species view
    recordSpeciesView,

    // Record a search query
    async recordSearch(req, res) {
        try {
            const { query, resultCount, sessionId: bodySessionId } = req.body;

            // Get user ID if authenticated
            const userId = req.user?.id || null;

            // Check all possible sources for sessionId with proper error handling
            let sessionId = null;
            if (req.cookies) sessionId = req.cookies.sessionId;
            if (!sessionId && req.headers) sessionId = req.headers['x-session-id'];
            if (!sessionId) sessionId = bodySessionId;

            // Get IP address with fallbacks
            const ipAddress = req.ip || (req.headers ? req.headers['x-forwarded-for'] : null) || null;

            await pool.query(
                `INSERT INTO search_history 
                (query_text, user_id, session_id, ip_address, result_count)
                VALUES ($1, $2, $3, $4, $5)`,
                [query, userId, sessionId, ipAddress, resultCount]
            );

            res.status(200).json({ success: true });
        } catch (error) {
            logger.error(`Error recording search: ${error.message}`);
            // Return 200 even on error to not disrupt user experience
            res.status(200).json({ success: false });
        }
    },

    // Get top viewed species
    async getTopViewedSpecies(req, res) {
        try {
            const { limit = 10, days = 30 } = req.query;

            const result = await pool.query(
                `SELECT sv.species_id, s.scientific_name, COUNT(*) as view_count
         FROM species_views sv
         JOIN species s ON sv.species_id = s.composite_key
         WHERE sv.viewed_at > NOW() - INTERVAL '${days} days'
         GROUP BY sv.species_id, s.scientific_name
         ORDER BY view_count DESC
         LIMIT $1`,
                [limit]
            );

            res.json(result.rows);
        } catch (error) {
            logger.error(`Error fetching top viewed species: ${error.message}`);
            res.status(500).json({
                message: "Error fetching analytics data",
                error: error.message
            });
        }
    },

    // Get top search queries
    async getTopSearches(req, res) {
        try {
            const { limit = 10, days = 30 } = req.query;

            const result = await pool.query(
                `SELECT query_text, COUNT(*) as search_count
         FROM search_history
         WHERE searched_at > NOW() - INTERVAL '${days} days'
         GROUP BY query_text
         ORDER BY search_count DESC
         LIMIT $1`,
                [limit]
            );

            res.json(result.rows);
        } catch (error) {
            logger.error(`Error fetching top searches: ${error.message}`);
            res.status(500).json({
                message: "Error fetching analytics data",
                error: error.message
            });
        }
    }
};

module.exports = analyticsController;