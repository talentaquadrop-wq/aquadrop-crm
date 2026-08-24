const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// =========================
// Route Imports
// =========================

const leadRoutes = require("./routes/leadRoutes");
const customerRoutes = require("./routes/customerRoutes");
const installationRoutes = require("./routes/installationRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dispatchRoutes = require("./routes/dispatchRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const ivrRoutes = require("./routes/ivrRoutes");
const callRoutes = require("./routes/callRoutes");
const ivrWebhookRoutes = require("./routes/ivrWebhookRoutes");

const app = express();

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://aqua-drop-crm-bf8.vercel.app",
      "https://aqua-drop-crm.vercel.app",
      "https://aqua-drop-crm-7fp2.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// =========================
// Health Check
// =========================

app.get("/", async (req, res) => {
  try {
    await connectDB();

    res.status(200).send("Aqua Drop Backend API Running...");
  } catch (error) {
    console.error("❌ Health Check DB Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =========================
// DATABASE MIDDLEWARE
// =========================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database Middleware Error:");
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =========================
// API Routes
// =========================

app.use("/api/leads", leadRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/installations", installationRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/dispatch", dispatchRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/quotations", quotationRoutes);

app.use("/api/ivr", ivrRoutes);

app.use("/api/calls", callRoutes);

app.use(
  "/api/ivr/webhook",
  ivrWebhookRoutes
);

// =========================
// 404 ROUTE
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =========================
// LOCAL SERVER
// =========================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Aqua Drop Backend running on port ${PORT}`
    );
  });
}

// =========================
// VERCEL EXPORT
// =========================

module.exports = app;