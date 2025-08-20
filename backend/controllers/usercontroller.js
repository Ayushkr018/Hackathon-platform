const User = require('../models/User');

/**
 * @desc      Get all users
 * @route     GET /api/users
 * @access    Private (Admin)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Get a single user
 * @route     GET /api/users/:id
 * @access    Private (Admin)
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc      Get current logged in user profile
 * @route     GET /api/users/me
 * @access    Private
 */
exports.getMe = async (req, res, next) => {
  try {
    // req.user.id is available from the 'protect' middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc      Update user profile details (name, bio, skills)
 * @route     PUT /api/users/me
 * @access    Private
 */
exports.updateMe = async (req, res, next) => {
    try {
        // 1. Filter out fields that are not allowed to be updated
        const filteredBody = { ...req.body };
        const forbiddenFields = ['password', 'role', 'email', '_id'];
        forbiddenFields.forEach(el => delete filteredBody[el]);

        // 2. Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true, // Return the new document
            runValidators: true // Run schema validators
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        next(error);
    }
};
