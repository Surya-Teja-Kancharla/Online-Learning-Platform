/**
 * Server Entry Point
 * Starts the Express server and handles graceful shutdown
 */

require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, async () => {
  console.log('=================================');
  console.log('🚀 Online Learning Platform API');
  console.log('=================================');
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('=================================');

  // Test database connection
  try {
    await db.testConnection();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Server will continue but database operations will fail');
  }

  console.log('=================================');
  console.log('Server is ready to accept requests');
  console.log('Press CTRL+C to stop\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  
  process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
  console.log('\n👋 SIGTERM received. Shutting down gracefully...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    try {
      await db.closePool();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.error('❌ Error closing database:', error.message);
    }
    
    console.log('👋 Process terminated');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    try {
      await db.closePool();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.error('❌ Error closing database:', error.message);
    }
    
    console.log('👋 Process terminated');
    process.exit(0);
  });
});

// Export server for testing
module.exports = server;