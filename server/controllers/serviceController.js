const Service = require("../models/Service");

// ===============================
// Create Service
// ===============================
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json(service);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ===============================
// Get All Services
// ===============================
const getServices = async (req, res) => {

  try {

    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.status(200).json(services);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ===============================
// Get Single Service
// ===============================
const getServiceById = async (req, res) => {

  try {

    const service = await Service.findById(req.params.id);

    if (!service) {

      return res.status(404).json({
        message: "Service not found",
      });

    }

    res.status(200).json(service);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ===============================
// Update Service
// ===============================
const updateService = async (req, res) => {

  try {

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!service) {

      return res.status(404).json({
        message: "Service not found",
      });

    }

    res.status(200).json(service);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ===============================
// Delete Service
// ===============================
const deleteService = async (req, res) => {

  try {

    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {

      return res.status(404).json({
        message: "Service not found",
      });

    }

    res.status(200).json({
      message: "Service Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};