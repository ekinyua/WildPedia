module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key',
    jwtExpiration: 86400, // 24 hours
    jwtRefreshExpiration: 604800, // 7 days

    // Password requirements
    passwordMinLength: 8,
    passwordMaxLength: 100,

    // Username requirements
    usernameMinLength: 3,
    usernameMaxLength: 50,

    // Email verification token expiration (in seconds)
    emailVerificationExpiration: 24 * 60 * 60, // 24 hours

    // Password reset token expiration (in seconds)
    passwordResetExpiration: 1 * 60 * 60, // 1 hour

    // Google OAuth settings
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
    }
};