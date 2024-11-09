// authMiddleware.js
const AppError = require('./appError');
const jwt = require('jsonwebtoken');

const authenticateSession = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    return next(new AppError('Unauthorized access - please log in', 401));
};

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(new AppError('Authentication token required', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role }; // Ensure req.user is set with user info
        next();
    } catch (error) {
        next(new AppError('Invalid or expired token', 401));
    }
};

module.exports = authenticateToken;

