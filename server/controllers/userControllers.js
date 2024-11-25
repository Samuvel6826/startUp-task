const UsersModel = require('../models/userModel');
const { logger } = require('../utils/logger'); // For logging important events or debugging information
const { handleClientError, handleServerError } = require('../middlewares/errorHandlers'); // Middleware for error handling

/**
 * Fetch all users by sorting
 * @route GET /api/user
 */
const getAllUsers = async (req, res) => {
    try {
        logger.info('Fetching all users from the database'); // Log the start of the operation

        // Fetch all users and sort them by `_id` in ascending order
        const data = await UsersModel.find().sort({ _id: 1 });

        if (!data || data.length === 0) {
            logger.warn('No users found in the database'); // Log a warning if no users are found
            return handleClientError(res, 'No users found', 404);
        }

        logger.info(`Successfully fetched ${data.length} user(s)`); // Log the success with the number of users

        res.status(200).json({
            data,
            message: 'Users fetched successfully',
        });
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`); // Log the error for debugging
        handleServerError(res, error); // Use middleware to handle the error
    }
};

module.exports = {
    getAllUsers,
};