const mongoose = require('mongoose');

const dbURI = "mongodb+srv://admin:root66@cluster0.trexk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
