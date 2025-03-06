const userModel = require('../models/user.model');
const logger = require('../logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// storage for profile images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/profiles');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `profile-${req.user.id}-${uniqueSuffix}${ext}`);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG files are allowed.'), false);
    }
};

// Create upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: fileFilter
}).single('profileImage');

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
    },

    // Add the uploadProfileImage method
    async uploadProfileImage(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message || "Error uploading image"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded"
                });
            }

            try {
                // Create URL for the uploaded image
                const baseUrl = process.env.BASE_URL || `http://${req.get('host')}`;
                const imagePath = `/uploads/profiles/${req.file.filename}`;
                const imageUrl = `${baseUrl}${imagePath}`;

                // Update user with profile image URL
                const updatedUser = await userModel.updateProfileImage(req.user.id, imageUrl);

                res.json({
                    message: "Profile image uploaded successfully",
                    profileImageUrl: imageUrl,
                    user: {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        role: updatedUser.role,
                        profileImageUrl: imageUrl
                    }
                });
            } catch (error) {
                logger.error(`Error updating profile image: ${error.message}`);
                res.status(500).json({
                    message: "Error updating profile image",
                    error: error.message
                });
            }
        });
    }
};

module.exports = userController;