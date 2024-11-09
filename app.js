// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config(); 

const albumRoutes = require('./albumRoutes');
const userRoutes = require('./userRoutes');
const connectDB = require('./db');
const errorHandler = require('./errorHandler');
const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());

// Connect to database
connectDB();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecret', // Use a secure secret in .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Session duration: 1 hour
}));

// Routes
app.use(userRoutes);
app.use('/albums', albumRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
