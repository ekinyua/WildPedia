const culturalContentModel = require('../models/cultural_content.model');
const logger = require('../logger');
const pool = require('../models/db')

const culturalContentController = {
    async createContent(req, res) {
        try {
            const { speciesId, contentType, title, content, language = 'en', source } = req.body;
            const authorId = req.user.id;

            // Add this debug logging
            console.log("Attempting to insert with speciesId:", speciesId);
            console.log("speciesId type:", typeof speciesId);
            console.log("speciesId length:", speciesId.length);

            // Log to database for later analysis
            await pool.query(
                'INSERT INTO debug_species_ids (submitted_id) VALUES ($1)',
                [speciesId]
            );

            // Input validation
            if (!speciesId || !contentType || !title || !content) {
                return res.status(400).json({
                    message: "Missing required fields"
                });
            }

            const newContent = await culturalContentModel.create({
                speciesId,
                contentType,
                title,
                content,
                language,
                source,
                authorId
            });

            logger.info(`New cultural content created by user ${authorId} for species ${speciesId}`);

            res.status(201).json({
                message: "Cultural content created successfully",
                content: newContent
            });
        } catch (error) {
            logger.error(`Error creating cultural content: ${error.message}`);
            res.status(500).json({
                message: "Error creating cultural content",
                error: error.message
            });
        }
    },

    async getSpeciesContent(req, res) {
        try {
            const { speciesId } = req.params;
            const { language = 'en' } = req.query;
            const userId = req.user?.id || null;

            // If user is admin/moderator, show all content
            // const statusFilter = req.user.isAdmin || req.user.isModerator
            //     ? ['pending', 'approved', 'rejected']
            //     : ['approved'];

            const content = await culturalContentModel.getBySpeciesId(
                speciesId,
                language,
                userId
            );

            res.json({
                speciesId,
                language,
                content
            });
        } catch (error) {
            logger.error(`Error fetching species content: ${error.message}`);
            res.status(500).json({
                message: "Error fetching cultural content",
                error: error.message
            });
        }
    },

    async updateContent(req, res) {
        try {
            const { contentId } = req.params;
            const { title, content, source } = req.body;
            const modifierId = req.user.id;

            // Check if user has permission to update
            const existingContent = await culturalContentModel.getContentHistory(contentId);
            if (!existingContent) {
                return res.status(404).json({
                    message: "Content not found"
                });
            }

            // Only admins, moderators, or original author can update
            if (!req.user.isAdmin && !req.user.isModerator &&
                existingContent.author_id !== req.user.id) {
                return res.status(403).json({
                    message: "Not authorized to update this content"
                });
            }

            const updatedContent = await culturalContentModel.updateContent(
                contentId,
                { title, content, source },
                modifierId
            );

            logger.info(`Cultural content ${contentId} updated by user ${modifierId}`);

            res.json({
                message: "Content updated successfully",
                content: updatedContent
            });
        } catch (error) {
            logger.error(`Error updating cultural content: ${error.message}`);
            res.status(500).json({
                message: "Error updating content",
                error: error.message
            });
        }
    },

    async moderateContent(req, res) {
        try {
            const { contentId } = req.params;
            const { status } = req.body;
            const modifierId = req.user.id;

            if (!req.user.isAdmin && !req.user.isModerator) {
                return res.status(403).json({
                    message: "Not authorized to moderate content"
                });
            }

            const updatedContent = await culturalContentModel.updateStatus(
                contentId,
                status,
                modifierId
            );

            logger.info(`Cultural content ${contentId} status updated to ${status} by moderator ${modifierId}`);

            res.json({
                message: "Content status updated successfully",
                content: updatedContent
            });
        } catch (error) {
            logger.error(`Error moderating content: ${error.message}`);
            res.status(500).json({
                message: "Error updating content status",
                error: error.message
            });
        }
    },

    async deleteContent(req, res) {
        try {
            const { contentId } = req.params;
            const modifierId = req.user.id;

            // Check if user has permission to delete
            const existingContent = await culturalContentModel.getContentHistory(contentId);
            if (!existingContent) {
                return res.status(404).json({
                    message: "Content not found"
                });
            }

            // Only admins, moderators, or original author can delete
            if (!req.user.isAdmin && !req.user.isModerator &&
                existingContent.author_id !== req.user.id) {
                return res.status(403).json({
                    message: "Not authorized to delete this content"
                });
            }

            await culturalContentModel.delete(contentId, modifierId);

            logger.info(`Cultural content ${contentId} deleted by user ${modifierId}`);

            res.json({
                message: "Content deleted successfully"
            });
        } catch (error) {
            logger.error(`Error deleting cultural content: ${error.message}`);
            res.status(500).json({
                message: "Error deleting content",
                error: error.message
            });
        }
    },

    async getContentForModeration(req, res) {
        try {
            if (!req.user.isAdmin && !req.user.isModerator) {
                return res.status(403).json({
                    message: "Not authorized to access moderation queue"
                });
            }

            const { status = 'pending', limit = 10, offset = 0 } = req.query;
            const content = await culturalContentModel.getContentForModeration(
                status,
                parseInt(limit),
                parseInt(offset)
            );

            res.json({
                status,
                content
            });
        } catch (error) {
            logger.error(`Error fetching moderation queue: ${error.message}`);
            res.status(500).json({
                message: "Error fetching moderation queue",
                error: error.message
            });
        }
    },

    async getUserContent(req, res) {
        try {
            const userId = req.params.userId || req.user.id;
            const { status } = req.query;

            // If requesting other user's content, must be admin/moderator
            if (userId !== req.user.id && !req.user.isAdmin && !req.user.isModerator) {
                return res.status(403).json({
                    message: "Not authorized to view other users' content"
                });
            }

            const content = await culturalContentModel.getUserContent(userId, status);

            res.json({
                userId,
                content
            });
        } catch (error) {
            logger.error(`Error fetching user content: ${error.message}`);
            res.status(500).json({
                message: "Error fetching user content",
                error: error.message
            });
        }
    }
};

module.exports = culturalContentController;