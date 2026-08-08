require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");

async function seedUsers() {
  try {
    // Connect Database
    await connectDB();

    console.log("✅ MongoDB Connected");

    // Delete Existing Users
    await User.deleteMany({});

    console.log("🗑 Old Users Deleted");

    // Create Users
    await User.create([
      {
        name: "Administrator",
        username: "admin",
        email: "admin@aquadrop.com",
        password: "Admin@123",
        role: "Admin",
      },
      {
        name: "Sales Executive",
        username: "sales",
        email: "sales@aquadrop.com",
        password: "Sales@123",
        role: "Sales",
      },
      {
        name: "Inventory Manager",
        username: "inventory",
        email: "inventory@aquadrop.com",
        password: "Inventory@123",
        role: "Inventory",
      },
      {
        name: "Dispatch Executive",
        username: "dispatch",
        email: "dispatch@aquadrop.com",
        password: "Dispatch@123",
        role: "Dispatch",
      },
      {
        name: "Service Engineer",
        username: "service",
        email: "service@aquadrop.com",
        password: "Service@123",
        role: "Service",
      },
    ]);

    console.log("");
    console.log("=======================================");
    console.log("✅ Aqua Drop Users Created Successfully");
    console.log("=======================================");
    console.log("");

    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seedUsers();