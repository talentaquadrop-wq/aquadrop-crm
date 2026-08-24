const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // Already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;

    console.log("✅ MongoDB Connected");
  } catch (error) {
    isConnected = false;

    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);

    // IMPORTANT:
    // Do NOT use process.exit(1) on Vercel
    throw error;
  }
};

module.exports = connectDB;