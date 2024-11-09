const AppError = require('./appError');
const Album = require('./albumVerif');

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('Access denied: Admins only', 403));
    }
    next();
};

const isOwnerOrAdmin = async (req, res, next) => {
    const album = await Album.findById(req.params.id);
    
    if (!album) {
        return next(new AppError('Album not found', 404));
    }

    if (album.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Access denied', 403));
    }

    next();
};

module.exports = { isAdmin, isOwnerOrAdmin };
