const Installation = require("../models/Installation");

// ===============================
// Create Installation
// ===============================
const createInstallation = async (req, res) => {
  try {
    const installation = await Installation.create(req.body);

    res.status(201).json({
      success: true,
      data: installation,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Get All Installations
// ===============================
const getInstallations = async (req, res) => {
  try {

    const installations = await Installation.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: installations,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Get Single Installation
// ===============================
const getInstallationById = async (req, res) => {

  try {

    const installation = await Installation.findById(req.params.id);

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: "Installation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: installation,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// Update Installation
// ===============================
const updateInstallation = async (req, res) => {

  try {

    const installation = await Installation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: "Installation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: installation,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// Delete Installation
// ===============================
const deleteInstallation = async (req, res) => {

  try {

    const installation = await Installation.findByIdAndDelete(
      req.params.id
    );

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: "Installation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Installation Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  createInstallation,
  getInstallations,
  getInstallationById,
  updateInstallation,
  deleteInstallation,
};