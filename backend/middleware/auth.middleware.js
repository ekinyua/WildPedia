// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth.config');
const userModel = require('../models/user.model');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    
    // Check if user still exists and is active
    const user = await userModel.findByUsername(decoded.username);
    if (!user || !user.is_active) {
      return res.status(403).json({ message: "User no longer valid" });
    }

    req.user = {
        ...decoded,
        isAdmin: user.role === 'admin',
        isModerator: user.role === 'moderator' || user.role === 'admin'
      };
      
      next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

const isModerator = (req, res, next) => {
  if (req.user && (req.user.role === 'moderator' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: "Moderator access required" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator
};