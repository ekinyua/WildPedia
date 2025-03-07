const userStatsModel = require('../models/user_stats.model');
const logger = require('../logger');

const userStatsController = {
    async getUserStats(req, res) {
        try {
            const userId = req.params.userId || req.user.id;

            if (req.params.userId && req.params.userId !== req.user.id && !req.user.isAdmin) {
                return res.status(403).json({
                    message: "You don't have permission to view these stats"
                });
            }

            const stats = await userStatsModel.getStats(userId);
            const rank = await userStatsModel.getUserRank(userId);

            res.json({
                userId,
                stats: {
                    ...stats,
                    rank
                }
            });
        } catch (error) {
            logger.error(`Error fetching user stats: ${error.message}`);
            res.status(500).json({
                message: "Error fetching user stats",
                error: error.message
            });
        }
    },

    async submitQuizResults(req, res) {
        try {
            const userId = req.user.id;
            const { correctAnswers, totalQuestions } = req.body;

            const result = await userStatsModel.updateXP(userId, correctAnswers, totalQuestions);

            res.json({
                xpEarned: result.xpEarned,
                stats: result.stats,
                newBadges: result.newBadges
            });
        } catch (error) {
            logger.error(`Error submitting quiz results: ${error.message}`);
            res.status(500).json({
                message: "Error submitting quiz results",
                error: error.message
            });
        }
    },

    async getLeaderboard(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;

            const leaderboard = await userStatsModel.getLeaderboard(limit);

            let userRank = null;
            if (req.user) {
                userRank = await userStatsModel.getUserRank(req.user.id);
            }

            res.json({
                leaderboard,
                userRank
            });
        } catch (error) {
            logger.error(`Error fetching leaderboard: ${error.message}`);
            res.status(500).json({
                message: "Error fetching leaderboard",
                error: error.message
            });
        }
    }
};

module.exports = userStatsController;