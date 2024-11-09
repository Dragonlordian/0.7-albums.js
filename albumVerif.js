const mongoose = require('mongoose');

// Define acceptable genres
const acceptableGenres = [
    'Pop',
    'Rock',
    'Jazz',
    'Hip-Hop',
    'Classical',
    'R&B',
    'Country',
    'Electronic',
    'Reggae',
    'Blues',
    'Metal',
    'Indie',
];

// Create schema
const albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
    },
    genre: {
        type: String,
        required: true,
        enum: acceptableGenres,
    },
    tracks: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
});

albumSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Album = mongoose.model('Album', albumSchema);
module.exports = Album;
