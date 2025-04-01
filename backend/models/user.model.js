const pool = require('./db');
const { hashPassword } = require('../utils/password.utils');

const userModel = {
    async create({ username, email, password, role = 'user' }) {
        const passwordHash = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role`,
            [username, email, passwordHash, role]
        );

        return result.rows[0];
    },

    async findByUsername(username) {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    async updateLastLogin(userId) {
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [userId]
        );
    },

    async createProfile(userId, profileData) {
        const { full_name, bio, location, organization, expertise_area } = profileData;

        const result = await pool.query(
            `INSERT INTO user_profiles 
       (user_id, full_name, bio, location, organization, expertise_area)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [userId, full_name, bio, location, organization, expertise_area]
        );

        return result.rows[0];
    },

    async saveResetToken(userId, token, expiresAt) {
        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, token, expiresAt]
        );
    },

    async findByResetToken(token) {
        const result = await pool.query(
            `SELECT u.*, t.expires_at
       FROM users u
       JOIN password_reset_tokens t ON t.user_id = u.id
       WHERE t.token = $1 AND t.expires_at > CURRENT_TIMESTAMP`,
            [token]
        );
        return result.rows[0];
    },

    async findByEmailToken(token) {
        const result = await pool.query(
            `SELECT u.*
       FROM users u
       JOIN verification_tokens v ON v.user_id = u.id
       WHERE v.token = $1 AND v.expires_at > CURRENT_TIMESTAMP`,
            [token]
        );
        return result.rows[0];
    },

    async saveVerificationToken(userId, token) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await pool.query(
            `INSERT INTO verification_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, token, expiresAt]
        );
    },

    async updatePassword(userId, newPasswordHash) {
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, userId]
        );

        // Delete all reset tokens for this user after password change
        await pool.query(
            'DELETE FROM password_reset_tokens WHERE user_id = $1',
            [userId]
        );
    },

    async verifyEmail(userId) {
        await pool.query(
            'UPDATE users SET email_verified = true WHERE id = $1',
            [userId]
        );

        // Delete verification token after successful verification
        await pool.query(
            'DELETE FROM verification_tokens WHERE user_id = $1',
            [userId]
        );
    },

    async updateProfile(userId, profileData) {
        const { full_name, bio, location, organization, expertise_area } = profileData;

        const result = await pool.query(
            `UPDATE user_profiles 
       SET full_name = COALESCE($1, full_name),
           bio = COALESCE($2, bio),
           location = COALESCE($3, location),
           organization = COALESCE($4, organization),
           expertise_area = COALESCE($5, expertise_area),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6
       RETURNING *`,
            [full_name, bio, location, organization, expertise_area, userId]
        );

        return result.rows[0];
    },

    async getProfile(userId) {
        const result = await pool.query(
            `SELECT u.id, u.username, u.email, u.role, u.profile_image_url, 
                    u.is_active, u.email_verified, u.last_login, 
                    p.user_id, p.full_name, p.location, 
                    p.organization, p.expertise_area
            FROM users u
            LEFT JOIN user_profiles p ON p.user_id = u.id
            WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    },

    async updateRole(userId, role) {
        const result = await pool.query(
            `UPDATE users 
       SET role = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, username, email, role`,
            [role, userId]
        );
        return result.rows[0];
    },

    async getAllUsers() {
        const result = await pool.query(
            `SELECT id, username, email, role, created_at
       FROM users
       ORDER BY created_at DESC`
        );
        return result.rows;
    },

    async findById(userId) {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        return result.rows[0];
    },

    // Find or create Google user
    async findOrCreateGoogleUser({ googleId, email, displayName, picture }) {
        try {
            console.log('Google auth data:', {
                googleId,
                email,
                displayName: displayName,
                displayNameType: typeof displayName,
                picture
            });
            // First, check if the user exists with this Google ID
            const googleUserResult = await pool.query(
                'SELECT * FROM users WHERE google_id = $1',
                [googleId]
            );

            if (googleUserResult.rows.length > 0) {
                // User exists with this Google ID
                return googleUserResult.rows[0];
            }

            // Check if a user exists with this email
            const emailUserResult = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (emailUserResult.rows.length > 0) {
                // Update existing user with Google ID
                const updateResult = await pool.query(
                    `UPDATE users 
           SET google_id = $1, 
               profile_image_url = COALESCE(profile_image_url, $2),
               updated_at = CURRENT_TIMESTAMP
           WHERE email = $3
           RETURNING *`,
                    [googleId, picture, email]
                );
                return updateResult.rows[0];
            }

            // Create a new user
            let username = displayName ? displayName.split(' ')[0].toLowerCase() : '';

            // If username is empty or invalid, use part of email instead
            if (!username || username.length < 3) {
                username = email.split('@')[0];
            }

            // Check if username already exists, if so append a number
            const usernameExists = await pool.query(
                'SELECT id FROM users WHERE username = $1',
                [username]
            );

            if (usernameExists.rows.length > 0) {
                username = `${username}${Math.floor(Math.random() * 1000)}`;
            }

            console.log('Generated username for Google auth:', username);

            const newUserResult = await pool.query(
                `INSERT INTO users 
         (username, email, google_id, password_hash, role, is_active, email_verified, profile_image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
                [username, email, googleId, 'GOOGLE_AUTH', 'user', true, true, picture]
            );

            // Create user profile
            await this.createProfile(newUserResult.rows[0].id, {
                full_name: displayName
            });

            return newUserResult.rows[0];
        } catch (error) {
            console.error('Error in findOrCreateGoogleUser:', error);
            throw error;
        }
    },

    // Helper function to generate a unique username from display name
    async generateUniqueUsername(displayName) {
        // Convert display name to lowercase and replace spaces with underscores
        let baseUsername = displayName.toLowerCase().replace(/\s+/g, '_');

        // Remove special characters
        baseUsername = baseUsername.replace(/[^a-z0-9_]/g, '');

        // Limit length
        // if (baseUsername.length > 40) {
        //     baseUsername = baseUsername.substring(0, 40);
        // }

        let username = baseUsername;
        let counter = 1;

        // Check if username exists and append number if needed
        while (true) {
            const result = await pool.query(
                'SELECT id FROM users WHERE username = $1',
                [username]
            );

            if (result.rows.length === 0) {
                return username;
            }

            username = `${baseUsername}${counter}`;
            counter++;
        }
    },

    async updateProfileImage(userId, imageUrl) {
        try {
            const result = await pool.query(
                `UPDATE users
             SET profile_image_url = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
                [imageUrl, userId]
            );

            return result.rows[0];
        } catch (error) {
            logger.error(`Error updating profile image: ${error.message}`);
            throw error;
        }
    },
};

module.exports = userModel;