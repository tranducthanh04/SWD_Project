const http = require('http');
const app = require('./src/app');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const { ensureUploadDirectories } = require('./src/utils/fileStorage');
const env = require('./src/config/env');

const startServer = async () => {
  try {
    ensureUploadDirectories();
    await connectDatabase();

    const server = http.createServer(app);

    server.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
