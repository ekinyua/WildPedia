const express = require('express');
const router = express.Router();
const speciesFactsController = require('../controllers/species_facts.controller');
const { verifyToken, isAdmin, isModerator } = require('../middleware/auth.middleware');
const { validateRequest, schemas } = require('../middleware/validation.middleware');

// Public routes (no authentication required)
router.get('/species/:speciesId', speciesFactsController.getSpeciesFacts);
router.get('/search', speciesFactsController.searchFacts);

// Protected routes (admin/moderator only)
router.post(
  '/',
  [verifyToken, isModerator, validateRequest(schemas.speciesFact)],
  speciesFactsController.createFact
);

router.put(
  '/:factId',
  [verifyToken, isModerator, validateRequest(schemas.speciesFactUpdate)],
  speciesFactsController.updateFact
);

router.delete(
  '/:factId',
  [verifyToken, isModerator],
  speciesFactsController.deleteFact
);

// Additional admin/moderator routes
router.get(
  '/history/:factId',
  [verifyToken, isModerator],
  speciesFactsController.getFactHistory
);

router.get(
  '/user/:userId',
  [verifyToken, isAdmin],
  speciesFactsController.getUserFacts
);

module.exports = router;