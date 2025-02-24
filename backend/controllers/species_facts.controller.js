const speciesFactsModel = require('../models/species_facts.model');
const logger = require('../logger');

const speciesFactsController = {
  async createFact(req, res) {
    try {
      // Only admins and moderators can create facts
      if (!req.user.isAdmin && !req.user.isModerator) {
        return res.status(403).json({
          message: "Only administrators and moderators can create species facts"
        });
      }

      const { speciesId, category, fact, sourceReference } = req.body;
      const createdBy = req.user.id;

      // Input validation
      if (!speciesId || !category || !fact) {
        return res.status(400).json({
          message: "Missing required fields"
        });
      }

      const newFact = await speciesFactsModel.create({
        speciesId,
        category,
        fact,
        sourceReference,
        createdBy
      });

      logger.info(`New species fact created by user ${createdBy} for species ${speciesId}`);
      
      res.status(201).json({
        message: "Species fact created successfully",
        fact: newFact
      });
    } catch (error) {
      logger.error(`Error creating species fact: ${error.message}`);
      res.status(500).json({
        message: "Error creating species fact",
        error: error.message
      });
    }
  },

  async getSpeciesFacts(req, res) {
    try {
      const { speciesId } = req.params;
      const { category } = req.query;

      const facts = category 
        ? await speciesFactsModel.getByCategory(speciesId, category)
        : await speciesFactsModel.getBySpeciesId(speciesId);
      
      res.json({
        speciesId,
        category: category || 'all',
        facts
      });
    } catch (error) {
      logger.error(`Error fetching species facts: ${error.message}`);
      res.status(500).json({
        message: "Error fetching species facts",
        error: error.message
      });
    }
  },

  async updateFact(req, res) {
    try {
      // Only admins and moderators can update facts
      if (!req.user.isAdmin && !req.user.isModerator) {
        return res.status(403).json({
          message: "Only administrators and moderators can update species facts"
        });
      }

      const { factId } = req.params;
      const { category, fact, sourceReference } = req.body;
      const modifierId = req.user.id;

      const updatedFact = await speciesFactsModel.updateFact(
        factId,
        { category, fact, sourceReference },
        modifierId
      );

      if (!updatedFact) {
        return res.status(404).json({
          message: "Fact not found"
        });
      }

      logger.info(`Species fact ${factId} updated by user ${modifierId}`);
      
      res.json({
        message: "Fact updated successfully",
        fact: updatedFact
      });
    } catch (error) {
      logger.error(`Error updating species fact: ${error.message}`);
      res.status(500).json({
        message: "Error updating fact",
        error: error.message
      });
    }
  },

  async deleteFact(req, res) {
    try {
      // Only admins and moderators can delete facts
      if (!req.user.isAdmin && !req.user.isModerator) {
        return res.status(403).json({
          message: "Only administrators and moderators can delete species facts"
        });
      }

      const { factId } = req.params;
      const modifierId = req.user.id;

      const deletedFact = await speciesFactsModel.delete(factId, modifierId);

      if (!deletedFact) {
        return res.status(404).json({
          message: "Fact not found"
        });
      }

      logger.info(`Species fact ${factId} deleted by user ${modifierId}`);
      
      res.json({
        message: "Fact deleted successfully"
      });
    } catch (error) {
      logger.error(`Error deleting species fact: ${error.message}`);
      res.status(500).json({
        message: "Error deleting fact",
        error: error.message
      });
    }
  },

  async getFactHistory(req, res) {
    try {
      const { factId } = req.params;

      // Only admins and moderators can view fact history
      if (!req.user.isAdmin && !req.user.isModerator) {
        return res.status(403).json({
          message: "Only administrators and moderators can view fact history"
        });
      }

      const history = await speciesFactsModel.getFactHistory(factId);
      
      res.json({
        factId,
        history
      });
    } catch (error) {
      logger.error(`Error fetching fact history: ${error.message}`);
      res.status(500).json({
        message: "Error fetching fact history",
        error: error.message
      });
    }
  },

  async searchFacts(req, res) {
    try {
      const { q: searchTerm } = req.query;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      if (!searchTerm) {
        return res.status(400).json({
          message: "Search term is required"
        });
      }

      const facts = await speciesFactsModel.searchFacts(searchTerm, limit, offset);
      
      res.json({
        searchTerm,
        facts
      });
    } catch (error) {
      logger.error(`Error searching facts: ${error.message}`);
      res.status(500).json({
        message: "Error searching facts",
        error: error.message
      });
    }
  },

  async getUserFacts(req, res) {
    try {
      // Only admins and moderators can view facts by user
      if (!req.user.isAdmin && !req.user.isModerator) {
        return res.status(403).json({
          message: "Only administrators and moderators can view facts by user"
        });
      }

      const userId = req.params.userId;
      const facts = await speciesFactsModel.getFactsByUser(userId);
      
      res.json({
        userId,
        facts
      });
    } catch (error) {
      logger.error(`Error fetching user facts: ${error.message}`);
      res.status(500).json({
        message: "Error fetching user facts",
        error: error.message
      });
    }
  }
};

module.exports = speciesFactsController;