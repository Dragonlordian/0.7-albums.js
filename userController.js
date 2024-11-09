// userController.js
const bcrypt = require('bcryptjs');
const User = require('./userModel');
const AppError = require('./appError');
const jwt = require('jsonwebtoken');


// Register User function (remains the same)
const registerUser = async (req, res, next) => {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation) {
        return next(new AppError('All fields are required', 400));
    }

    if (password !== passwordConfirmation) {
        return next(new AppError('Password confirmation does not match password', 400));
    }

    try {
        const user = new User({ name, email, password});
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        return next(new AppError('Server error during registration', 500));
    }
};

// Login User function
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Invalid email', 401));
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid password', 401));
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(process.env.JWT_SECRET)
        // Set session information
        req.session.userId = user._id;
        req.session.isAuthenticated = true;

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error)
        return next(new AppError('Server error during login', 500));
    }
};

// Logout User function
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: 'Logout successful' });
    });
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(new AppError('Error deleting user', 500));
    }
};

module.exports = { registerUser, loginUser, deleteUser, logoutUser };
