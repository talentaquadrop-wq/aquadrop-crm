const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Installation = require("../models/Installation");
const Service = require("../models/Service");
const Product = require("../models/Product");

console.log("🔥 NEW DASHBOARD CONTROLLER LOADED");

// ====================================
// Dashboard Statistics
// ====================================
const getDashboardStats = async (req, res) => {

  console.log("🔥 getDashboardStats RUNNING");

  try {

    // ===============================
    // Role Based Lead Filter
    // ===============================
    let leadQuery = {};

    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Manager"
    ) {
      leadQuery.assignedTo = req.user._id;
    }

    // ===============================
    // Counts
    // ===============================
    const totalLeads = await Lead.countDocuments(leadQuery);

    const totalCustomers = await Customer.countDocuments();

    const totalInstallations = await Installation.countDocuments();

    const pendingServices = await Service.countDocuments({
      status: "Pending",
    });

    const completedServices = await Service.countDocuments({
      status: "Completed",
    });

    const totalProducts = await Product.countDocuments();

    // ===============================
    // Low Stock
    // ===============================
    const lowStockProducts = await Product.find({
      quantity: { $lte: 5 },
    })
      .sort({ quantity: 1 })
      .limit(5);

    // ===============================
    // Today
    // ===============================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = await Lead.countDocuments({
      ...leadQuery,
      createdAt: { $gte: today },
    });

    const todayCustomers = await Customer.countDocuments({
      createdAt: { $gte: today },
    });

    // ===============================
    // Recent Data
    // ===============================
    const recentLeads = await Lead.find(leadQuery)
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentInstallations = await Installation.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentServices = await Service.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // ===============================
    // Response
    // ===============================
    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        totalCustomers,
        totalInstallations,
        pendingServices,
        completedServices,
        totalProducts,
        todayLeads,
        todayCustomers,
        recentLeads,
        recentCustomers,
        recentInstallations,
        recentServices,
        lowStockProducts,
      },
    });

  } catch (error) {

    console.error("❌ Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getDashboardStats,
};