const Customer = require("../models/Customer");
const Service = require("../models/Service");
const Product = require("../models/Product");
const Installation = require("../models/Installation");

const getReports = async (req, res) => {

  try {

    // =========================
    // Counts
    // =========================

    const totalCustomers = await Customer.countDocuments();

    const totalServices = await Service.countDocuments();

    const totalInstallations = await Installation.countDocuments();

    const totalProducts = await Product.countDocuments();

    // =========================
    // Products Sold
    // =========================

    const totalProductsSold = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$quantity",
          },
        },
      },
    ]);

    // =========================
    // Revenue
    // =========================

    const revenue = await Service.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // =========================
    // Monthly Revenue
    // =========================

    const monthlyRevenue = await Service.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // =========================
    // Monthly Installations
    // =========================

    const monthlySales = await Installation.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$installationDate",
            },
          },
          sales: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // =========================
    // Product Category Report
    // =========================

    const categorySales = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: {
            $sum: "$quantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    // =========================
    // Top Products
    // =========================

    const topProducts = await Product.find()
      .sort({ quantity: -1 })
      .limit(5)
      .select("productName quantity category");

    // =========================
    // Recent Reports
    // =========================

    const recentReports = [
      {
        id: 1,
        name: "Customer Report",
        date: new Date(),
        type: "Customers",
      },
      {
        id: 2,
        name: "Service Report",
        date: new Date(),
        type: "Services",
      },
      {
        id: 3,
        name: "Installation Report",
        date: new Date(),
        type: "Installations",
      },
      {
        id: 4,
        name: "Inventory Report",
        date: new Date(),
        type: "Inventory",
      },
    ];

    // =========================
    // Final Response
    // =========================

    res.status(200).json({
      success: true,
      data: {

        totalCustomers,

        totalServices,

        totalInstallations,

        totalProducts,

        totalProductsSold:
          totalProductsSold.length > 0
            ? totalProductsSold[0].total
            : 0,

        totalRevenue:
          revenue.length > 0
            ? revenue[0].totalRevenue
            : 0,

        monthlyRevenue,

        monthlySales,

        categorySales,

        topProducts,

        recentReports,

      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getReports,
};