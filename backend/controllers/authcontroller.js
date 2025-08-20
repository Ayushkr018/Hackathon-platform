const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto'); // Import the crypto module

// Helper function to sign a JWT
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Helper function to create and send a token in the response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.passwordHash = undefined; // Remove password from output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * @desc      Register a new user
 * @route     POST /api/auth/register
 * @access    Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await User.create({
      name,
      email,
      passwordHash: password,
      role
    });
    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Login user
 * @route     POST /api/auth/login
 * @access    Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// --- NEW: FORGOT PASSWORD LOGIC ---

/**
 * @desc      Forgot Password - Step 1: Send reset code
 * @route     POST /api/auth/forgotpassword
 */
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that email address.' });
        }

        // Generate a 6-digit random code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the code and save it to the user document
        user.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

        await user.save({ validateBeforeSave: false });

        // In a real app, you would email this code. For this demo, we log it.
        console.log(`Password reset code for ${user.email}: ${resetCode}`);

        res.status(200).json({
            status: 'success',
            message: 'Verification code sent to your email (check the backend console).'
        });
    } catch (error) {
        // Clear tokens on error and save
        if (req.user) {
            req.user.resetPasswordToken = undefined;
            req.user.resetPasswordExpire = undefined;
            await req.user.save({ validateBeforeSave: false });
        }
        next(error);
    }
};


/**
 * @desc      Reset Password - Step 2: Reset with new password
 * @route     PUT /api/auth/resetpassword
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, code, password } = req.body;

        // 1) Hash the incoming code
        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

        // 2) Find user by email, hashed code, and check if the code has not expired
        const user = await User.findOne({
            email,
            resetPasswordToken: hashedCode,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Code is invalid or has expired.' });
        }

        // 3) If code is valid, set the new password
        user.passwordHash = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // 4) Log the user in and send JWT
        createSendToken(user, 200, res);

    } catch (error) {
        next(error);
    }
};


// --- Social Login & Other Functions ---

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
        }
        const token = signToken(user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    })(req, res, next);
};
exports.githubAuth = passport.authenticate('github', { scope: ['user:email'] });
exports.githubCallback = (req, res, next) => {
    passport.authenticate('github', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
        }
        const token = signToken(user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    })(req, res, next);
};
exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};
exports.logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logout successful' });
};
