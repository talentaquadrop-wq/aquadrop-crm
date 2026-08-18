const reportRoutes = require("./routes/reportRoutes");
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
const dispatchRoutes = require("./routes/dispatchRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const ivrRoutes = require("./routes/ivrRoutes");
const callRoutes = require("./routes/callRoutes");
const ivrWebhookRoutes = require("./routes/ivrWebhookRoutes");

const app = express();

// =========================
// Connect MongoDB
// =========================

connectDB();

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://aqua-drop-crm-bf8.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
  res.send("🚀 Aqua Drop Backend API Running...");
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
// 404 Route
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Aqua Drop Backend running on port ${PORT}`
  );
});

module.exports = app;