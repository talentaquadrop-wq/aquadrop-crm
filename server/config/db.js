const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
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

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    isConnected = false;

    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;