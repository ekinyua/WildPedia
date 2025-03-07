const express = require('express');
const router = express.Router();
const userStatsController = require('../controllers/user_stats.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validateRequest, schemas } = require('../middleware/validation.middleware');

// Get current user's stats
router.get(
    '/stats',
    verifyToken,
    userStatsController.getUserStats
);

// Get leaderboard (public, no auth required)
router.get(
    '/leaderboard',
    userStatsController.getLeaderboard
);

// Submit quiz results
router.post(
    '/quiz-results',
    [
        verifyToken,
        validateRequest(schemas.quizResult)
    ],
    userStatsController.submitQuizResults
);

// Admin endpoint to get specific user's stats
router.get(
    '/stats/:userId',
    [verifyToken, isAdmin],
    userStatsController.getUserStats
);

module.exports = router;