class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call parent constructor with the message

        this.statusCode = statusCode || 500; // Default to 500 if no statusCode is provided
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Use 'fail' for 4xx errors, 'error' for others
        this.isOperational = true; // Mark as operational error
    }
}

module.exports = AppError;
