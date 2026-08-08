require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    // Connect Database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@aquadrop.com",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    // Create Admin
    const admin = new User({
      name: "Sandeep",
      email: "admin@aquadrop.com",
      password: "Admin@123",
      role: "Admin",
    });

    await admin.save();

    console.log("🎉 Admin created successfully!");
    console.log("Email: admin@aquadrop.com");
    console.log("Password: Admin@123");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();