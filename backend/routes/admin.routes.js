const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');
const adminDashboardController = require('../controllers/admin.dashboard.controller');
const moderationController = require('../controllers/admin.moderation.controller');
const speciesController = require('../controllers/admin.species.controller');

// Routes for public analytics tracking
router.post('/analytics/view/:speciesId', analyticsController.recordSpeciesView);
router.post('/analytics/search', analyticsController.recordSearch);

// Admin authenticated routes
// Only users with admin role can access these
router.use(verifyToken, isAdmin);

// Dashboard routes
router.get('/dashboard/summary', adminDashboardController.getDashboardSummary);
router.get('/dashboard/users', adminDashboardController.getUserStats);
router.get('/dashboard/content', adminDashboardController.getContentStats);
router.get('/dashboard/species', adminDashboardController.getSpeciesStats);
router.get('/users', adminDashboardController.listUsers);
router.put('/users/:userId/status', adminDashboardController.updateUserStatus);

// Analytics routes
router.get('/analytics/top-species', analyticsController.getTopViewedSpecies);
router.get('/analytics/top-searches', analyticsController.getTopSearches);

// Content moderation routes
router.get('/moderation/queue', moderationController.getModerationQueue);
router.put('/moderation/:contentId', moderationController.moderateContent);
router.post('/moderation/bulk', moderationController.bulkModerateContent);

// Species management routes
router.get('/species', speciesController.getSpeciesList);
router.get('/species/taxonomy', speciesController.getTaxonomyLists);
router.post('/species', speciesController.createSpecies);
router.put('/species/:compositeKey', speciesController.updateSpecies);

module.exports = router;