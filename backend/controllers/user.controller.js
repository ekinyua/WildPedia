const userModel = require('../models/user.model');
const logger = require('../logger');

const userController = {
  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validate role value
      const validRoles = ['user', 'moderator', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role specified"
        });
      }

      // Check if user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      // Prevent self-role modification
      if (parseInt(userId) === req.user.id) {
        return res.status(403).json({
          message: "Cannot modify your own role"
        });
      }

      const updatedUser = await userModel.updateRole(userId, role);
      
      logger.info(`User ${userId} role updated to ${role} by admin ${req.user.id}`);

      res.json({
        message: "User role updated successfully",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role
        }
      });
    } catch (error) {
      logger.error(`Error updating user role: ${error.message}`);
      res.status(500).json({
        message: "Error updating user role",
        error: error.message
      });
    }
  },

  async listUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      })));
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      res.status(500).json({
        message: "Error fetching users",
        error: error.message
      });
    }
  }
};

module.exports = userController;