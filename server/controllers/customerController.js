const Customer = require("../models/Customer");

// =============================
// Create Customer
// =============================

const addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =============================
// Get All Customers
// =============================

const getCustomers = async (req, res) => {
  try {

    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: customers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =============================
// Update Customer
// =============================

const updateCustomer = async (req, res) => {
  try {

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: customer,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =============================
// Delete Customer
// =============================

const deleteCustomer = async (req, res) => {
  try {

    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Customer Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =============================
// Customer Dashboard Stats
// =============================

const getCustomerStats = async (req, res) => {
  try {

    const totalCustomers = await Customer.countDocuments();

    const activeCustomers = await Customer.countDocuments({
      status: "Active",
    });

    const inactiveCustomers = await Customer.countDocuments({
      status: "Inactive",
    });

    const amcCustomers = await Customer.countDocuments({
      amc: true,
    });

    const warrantyCustomers = await Customer.countDocuments({
      warranty: "Active",
    });

    const paidCustomers = await Customer.countDocuments({
      paymentStatus: "Paid",
    });

    const pendingCustomers = await Customer.countDocuments({
      paymentStatus: "Pending",
    });

    const revenue = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,

      data: {

        totalCustomers,

        activeCustomers,

        inactiveCustomers,

        amcCustomers,

        warrantyCustomers,

        paidCustomers,

        pendingCustomers,

        totalRevenue:
          revenue.length > 0
            ? revenue[0].totalRevenue
            : 0,

      },

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {

  addCustomer,

  getCustomers,

  updateCustomer,

  deleteCustomer,

  getCustomerStats,

};