const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const teamRoutes = require('./routes/teams');
const projectRoutes = require('./routes/projects');
const judgeRoutes = require('./routes/judge');
const organizerRoutes = require('./routes/organise');
const announcementRoutes = require('./routes/announcements');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');

// Import config
require('./config/passport');
const swaggerSetup = require('./config/swagger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Passport middleware
app.use(passport.initialize());

// Swagger documentation
// swaggerSetup(app); // Temporarily disabled for debugging

// API routes - DEBUGGING STEP
// We will uncomment these one by one to find the broken file.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/announcements', announcementRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
