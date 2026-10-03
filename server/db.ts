import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildai_hub';

  try {
    // Attempt connecting to the configured or default MongoDB instance
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] Successfully connected to MongoDB at ${mongoUri}`);
  } catch (err: any) {
    console.warn(`[Database] Local MongoDB connection unavailable (${err.message}). Initializing embedded database fallback...`);

    try {
      // Dynamic import of mongodb-memory-server for zero-setup local execution
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'buildai_hub',
        },
      });
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[Database] Embedded in-memory MongoDB initialized and connected at ${memoryUri}`);
    } catch (fallbackErr: any) {
      console.error('[Database] Failed to initialize embedded MongoDB fallback:', fallbackErr);
      throw fallbackErr;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
