// MongoDB Database Configuration
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createInMemoryMongo = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri, options);
    console.log('✓ In-memory MongoDB connected');
    return conn;
  } catch (err) {
    console.error('✗ In-memory MongoDB startup failed:', err.message);
    if (process.platform === 'win32') {
      console.error('⚠️ Windows Visual C++ Redistributable may be required to run the MongoDB binary.');
      console.error('Install the latest supported Visual C++ Redistributable for Visual Studio:');
      console.error('https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist');
    }
    throw err;
  }
};

/**
 * Connect to a MongoDB database or fallback to in-memory MongoDB for development
 * @returns {Promise} - Connection promise
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth-app';

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`✗ MongoDB connection failed: ${error.message}`);
    console.warn('⚠️ Attempting to fall back to in-memory MongoDB for development.');
    return createInMemoryMongo();
  }
};

module.exports = connectDB;
