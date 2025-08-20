// server.js

// IMPORTANT: Load environment variables at the very top of the entry file.
require('dotenv').config();

const { connectDB } = require("./config/database");

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 5000;
let server;

// Create an async function to start the server
const startServer = async () => {
  try {
    // 1. Connect to the databases and wait for it to finish.
    await connectDB();

    // 2. NOW that the DB is connected, we can safely load the app.
    const app = require('./app');

    // 3. Start the server and listen for requests.
    server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("❌ Failed to start server due to database connection error:", error);
    process.exit(1);
  }
};

// Execute the function to start the server
startServer();


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown for signals like SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  }
});
