const pool = require('./db');
const logger = require('../logger');

const userStatsModel = {
    async getStats(userId) {
        try {
            const result = await pool.query(
                'SELECT * FROM user_stats WHERE user_id = $1',
                [userId]
            );

            if (result.rows.length === 0) {
                const newStats = await pool.query(
                    `INSERT INTO user_stats (user_id, xp, quizzes_completed, correct_answers)
           VALUES ($1, 0, 0, 0)
           RETURNING *`,
                    [userId]
                );
                return newStats.rows[0];
            }

            return result.rows[0];
        } catch (error) {
            logger.error(`Error getting user stats: ${error.message}`);
            throw error;
        }
    },

    async updateXP(userId, correctAnswers, totalQuestions) {
        try {
            // Get current stats
            let stats = await this.getStats(userId);

            // Calculate XP to add (10 XP per correct answer)
            const xpToAdd = correctAnswers * 10;

            // Update stats
            const updatedStats = await pool.query(
                `UPDATE user_stats
         SET xp = xp + $1,
             quizzes_completed = quizzes_completed + 1,
             correct_answers = correct_answers + $2
         WHERE user_id = $3
         RETURNING *`,
                [xpToAdd, correctAnswers, userId]
            );

            // Check for new badges
            const newBadges = await this.checkForBadges(userId);

            return {
                stats: updatedStats.rows[0],
                xpEarned: xpToAdd,
                newBadges
            };
        } catch (error) {
            logger.error(`Error updating user XP: ${error.message}`);
            throw error;
        }
    },

    async checkForBadges(userId) {
        try {
            const stats = await this.getStats(userId);

            const currentBadges = stats.badges || [];

            const newBadges = [];

            if (stats.quizzes_completed >= 5 &&
                !currentBadges.some(b => b.type === 'quiz_5')) {
                newBadges.push({
                    type: 'quiz_5',
                    name: 'Quiz Novice',
                    description: 'Completed 5 quizzes',
                    awarded_at: new Date()
                });
            }

            if (stats.quizzes_completed >= 25 &&
                !currentBadges.some(b => b.type === 'quiz_25')) {
                newBadges.push({
                    type: 'quiz_25',
                    name: 'Quiz Master',
                    description: 'Completed 25 quizzes',
                    awarded_at: new Date()
                });
            }

            if (stats.xp >= 500 &&
                !currentBadges.some(b => b.type === 'xp_500')) {
                newBadges.push({
                    type: 'xp_500',
                    name: 'Knowledge Seeker',
                    description: 'Earned 500 XP',
                    awarded_at: new Date()
                });
            }

            if (stats.xp >= 1000 &&
                !currentBadges.some(b => b.type === 'xp_1000')) {
                newBadges.push({
                    type: 'xp_1000',
                    name: 'Knowledge Expert',
                    description: 'Earned 1000 XP',
                    awarded_at: new Date()
                });
            }

            if (newBadges.length > 0) {
                const allBadges = [...currentBadges, ...newBadges];

                await pool.query(
                    `UPDATE user_stats
           SET badges = $1
           WHERE user_id = $2`,
                    [JSON.stringify(allBadges), userId]
                );
            }

            return newBadges;
        } catch (error) {
            logger.error(`Error checking for badges: ${error.message}`);
            return [];
        }
    },

    async getLeaderboard(limit = 10) {
        try {
            const result = await pool.query(
                `SELECT s.user_id, u.username, s.xp, s.quizzes_completed, 
                s.correct_answers, s.badges,
                ROW_NUMBER() OVER (ORDER BY s.xp DESC) as rank
         FROM user_stats s
         JOIN users u ON s.user_id = u.id
         ORDER BY s.xp DESC
         LIMIT $1`,
                [limit]
            );

            return result.rows;
        } catch (error) {
            logger.error(`Error getting leaderboard: ${error.message}`);
            throw error;
        }
    },

    async getUserRank(userId) {
        try {
            const result = await pool.query(
                `SELECT COUNT(*) + 1 as rank
         FROM user_stats
         WHERE xp > (SELECT xp FROM user_stats WHERE user_id = $1)`,
                [userId]
            );

            return parseInt(result.rows[0].rank);
        } catch (error) {
            logger.error(`Error getting user rank: ${error.message}`);
            return null;
        }
    }
};

module.exports = userStatsModel;