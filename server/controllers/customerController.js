const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Quotation = require("../models/Quotation");
const Installation = require("../models/Installation");
const Service = require("../models/Service");
const Payment = require("../models/Payment");
const { createAuditLog } = require("./auditController");

// =============================
// Create Customer
// =============================

const addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    await createAuditLog({ req, action: "Created", module: "Customers", entityId: customer._id, entityName: customer.name, details: `Customer ${customer.name} created` });

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

    const before = await Customer.findById(req.params.id);
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (customer) await createAuditLog({ req, action: "Updated", module: "Customers", entityId: customer._id, entityName: customer.name, details: before ? "Customer details updated" : "Customer updated" });

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

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (customer) await createAuditLog({ req, action: "Deleted", module: "Customers", entityId: customer._id, entityName: customer.name, details: "Customer deleted" });

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

const getCustomer360 = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).lean();
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    const [leads, quotations, installations, services, payments] = await Promise.all([
      Lead.find({ phone: customer.phone }).sort({ createdAt: -1 }).limit(25).lean(),
      Quotation.find({ $or: [{ customer: customer._id }, { phone: customer.phone }] }).sort({ createdAt: -1 }).limit(25).lean(),
      Installation.find({ $or: [{ customer: customer._id }, { phone: customer.phone }] }).sort({ createdAt: -1 }).limit(25).lean(),
      Service.find({ $or: [{ customer: customer._id }, { phone: customer.phone }] }).sort({ createdAt: -1 }).limit(25).lean(),
      Payment.find({ customer: customer._id }).sort({ paymentDate: -1 }).limit(50).populate("recordedBy", "name").lean(),
    ]);
    const paid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    res.json({ success: true, data: { customer, leads, quotations, installations, services, payments, paymentSummary: { paid, customerAmount: Number(customer.amount || 0), balance: Math.max(Number(customer.amount || 0) - paid, 0) } } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const addCustomerPayment = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Payment amount must be greater than zero" });
    const payment = await Payment.create({ customer: customer._id, amount, method: req.body.method || "UPI", reference: req.body.reference || "", paymentDate: req.body.paymentDate || new Date(), notes: req.body.notes || "", recordedBy: req.user?._id });
    const totalPaid = await Payment.aggregate([{ $match: { customer: customer._id } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const paid = totalPaid[0]?.total || 0;
    customer.paymentStatus = paid >= Number(customer.amount || 0) && Number(customer.amount || 0) > 0 ? "Paid" : "Pending";
    await customer.save();
    await createAuditLog({ req, action: "Payment Added", module: "Payments", entityId: customer._id, entityName: customer.name, details: `₹${amount.toLocaleString("en-IN")} via ${payment.method}` });
    res.status(201).json({ success: true, data: payment, paymentStatus: customer.paymentStatus });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports.getCustomer360 = getCustomer360;
module.exports.addCustomerPayment = addCustomerPayment;
