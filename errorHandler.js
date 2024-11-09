const AppError = require('./appError');

const errorHandler = (err, req, res, next) => {
  console.error(err);  // Log the error for debugging

  // Check for specific error types and send appropriate responses
  if (err instanceof AppError) {
      return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
      });
  }

  // For unknown errors, send a generic 500 message
  res.status(500).json({ status: 'error', message: 'Internal server error' });
};

module.exports = errorHandler;
