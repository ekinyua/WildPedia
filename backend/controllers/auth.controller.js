const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { comparePassword, hashPassword } = require('../utils/password.utils');
const { jwtSecret, jwtExpiration } = require('../config/auth.config');

const authController = {
    async signup(req, res) {
        try {
            const { username, email, password, ...profileData } = req.body;

            // Checking if username or email already exists
            const existingUser = await userModel.findByUsername(username) ||
                await userModel.findByEmail(email);

            if (existingUser) {
                return res.status(400).json({
                    message: "Username or email already in use"
                });
            }

            // Create user
            const user = await userModel.create({
                username,
                email,
                password
            });

            // Create user profile
            if (Object.keys(profileData).length > 0) {
                await userModel.createProfile(user.id, profileData);
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                jwtSecret,
                { expiresIn: jwtExpiration }
            );

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({
                message: "Error registering user",
                error: error.message
            });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find user
            const user = await userModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            // Verify password
            const passwordValid = await comparePassword(password, user.password_hash);
            if (!passwordValid) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            // Update last login
            await userModel.updateLastLogin(user.id);

            // Generate token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                jwtSecret,
                { expiresIn: jwtExpiration }
            );

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({
                message: "Error during login",
                error: error.message
            });
        }
    },

    // Google OAuth callback
    googleCallback(req, res) {
        try {
            // user is attached by passport
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: "Authentication failed"
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                jwtSecret,
                { expiresIn: jwtExpiration }
            );

            // Update last login
            userModel.updateLastLogin(user.id);

            // For API, respond with JSON
            if (req.query.format === 'json') {
                return res.json({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        profileImageUrl: user.profile_image_url
                    },
                    token
                });
            }

            // For browser flow, redirect to frontend with token
            const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google-callback?token=${token}`;
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error in googleCallback:', error);
            res.status(500).json({
                message: "Error during Google authentication",
                error: error.message
            });
        }
    },

    async getProfile(req, res) {
        try {
            const profile = await userModel.getProfile(req.user.id);
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            res.json(profile);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching profile",
                error: error.message
            });
        }
    },

    async updateProfile(req, res) {
        try {
            const updatedProfile = await userModel.updateProfile(req.user.id, req.body);
            if (!updatedProfile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            res.json(updatedProfile);
        } catch (error) {
            res.status(500).json({
                message: "Error updating profile",
                error: error.message
            });
        }
    },

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await userModel.findByUsername(req.user.username);

            // Verify current password
            const passwordValid = await comparePassword(currentPassword, user.password_hash);
            if (!passwordValid) {
                return res.status(401).json({
                    message: "Current password is incorrect"
                });
            }

            // Hash and update new password
            const newPasswordHash = await hashPassword(newPassword);
            await userModel.updatePassword(user.id, newPasswordHash);

            res.json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({
                message: "Error changing password",
                error: error.message
            });
        }
    },

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await userModel.findByEmail(email);

            if (!user) {
                return res.status(200).json({
                    message: "If an account exists with this email, a reset link will be sent"
                });
            }

            // Generate and save reset token
            const resetToken = generateResetToken();
            const expiresAt = new Date(Date.now() + 3600000); // 1 hour
            await userModel.saveResetToken(user.id, resetToken, expiresAt);

            res.json({
                message: "If an account exists with this email, a reset link will be sent"
            });
        } catch (error) {
            res.status(500).json({
                message: "Error requesting password reset",
                error: error.message
            });
        }
    },

    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            const user = await userModel.findByResetToken(token);

            if (!user) {
                return res.status(400).json({
                    message: "Invalid or expired reset token"
                });
            }

            const passwordHash = await hashPassword(password);
            await userModel.updatePassword(user.id, passwordHash);

            res.json({ message: "Password reset successfully" });
        } catch (error) {
            res.status(500).json({
                message: "Error resetting password",
                error: error.message
            });
        }
    }
};

module.exports = authController;