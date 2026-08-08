const Dispatch = require("../models/Dispatch");

// ======================================
// Create Dispatch
// ======================================

const addDispatch = async (req, res) => {
  try {
    const count = await Dispatch.countDocuments();

    const orderId = `AD-${1001 + count}`;

    const dispatch = await Dispatch.create({
      ...req.body,
      orderId,
    });

    res.status(201).json({
      success: true,
      data: dispatch,
    });
  } catch (error) {
    console.error("addDispatch Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Dispatches
// ======================================

const getDispatches = async (req, res) => {
  try {
    const dispatches = await Dispatch.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: dispatches,
    });
  } catch (error) {
    console.error("getDispatches Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Dispatch
// ======================================

const updateDispatch = async (req, res) => {
  try {
    const dispatch = await Dispatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: dispatch,
    });
  } catch (error) {
    console.error("updateDispatch Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Dispatch
// ======================================

const deleteDispatch = async (req, res) => {
  try {
    await Dispatch.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Dispatch Deleted Successfully",
    });
  } catch (error) {
    console.error("deleteDispatch Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Dashboard Stats
// ======================================

const getDispatchStats = async (req, res) => {
  try {
    const totalDispatches = await Dispatch.countDocuments();

    const pending = await Dispatch.countDocuments({
      status: "Pending",
    });

    const packed = await Dispatch.countDocuments({
      status: "Packed",
    });

    const dispatched = await Dispatch.countDocuments({
      status: "Dispatched",
    });

    const outForDelivery = await Dispatch.countDocuments({
      status: "Out For Delivery",
    });

    const delivered = await Dispatch.countDocuments({
      status: "Delivered",
    });

    res.status(200).json({
      success: true,
      data: {
        totalDispatches,
        pending,
        packed,
        dispatched,
        outForDelivery,
        delivered,
      },
    });
  } catch (error) {
    console.error("getDispatchStats Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addDispatch,
  getDispatches,
  updateDispatch,
  deleteDispatch,
  getDispatchStats,
};