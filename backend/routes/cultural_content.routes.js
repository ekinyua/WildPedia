const express = require('express');
const router = express.Router();
const culturalContentController = require('../controllers/cultural_content.controller');
const { verifyToken, isAdmin, isModerator } = require('../middleware/auth.middleware');
const { validateRequest, schemas } = require('../middleware/validation.middleware');
const contentVotesController = require('../controllers/cultural_content_votes.controller');


// Public routes (no authentication required)
router.get('/species/:speciesId', verifyToken, culturalContentController.getSpeciesContent);

// Protected routes (authentication required)
router.post(
    '/',
    [verifyToken, validateRequest(schemas.culturalContent)],
    culturalContentController.createContent
);

router.put(
    '/:contentId',
    [verifyToken, validateRequest(schemas.culturalContentUpdate)],
    culturalContentController.updateContent
);

router.delete(
    '/:contentId',
    verifyToken,
    culturalContentController.deleteContent
);

router.post(
    '/:contentId/vote',
    verifyToken,
    contentVotesController.voteForContent
);

// Get user's own content
router.get(
    '/user/content',
    verifyToken,
    culturalContentController.getUserContent
);

// Moderator/Admin routes
router.get(
    '/moderation/queue',
    [verifyToken, isModerator],
    culturalContentController.getContentForModeration
);

router.put(
    '/moderation/:contentId',
    [verifyToken, isModerator, validateRequest(schemas.contentModeration)],
    culturalContentController.moderateContent
);

// Admin only routes
router.get(
    '/user/:userId/content',
    [verifyToken, isAdmin],
    culturalContentController.getUserContent
);

module.exports = router;