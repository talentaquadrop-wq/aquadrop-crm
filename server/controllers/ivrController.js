const IVRConfig = require("../models/IVRConfig");

// =========================================
// GET IVR CONFIGURATION
// =========================================

const getIVRConfig = async (req, res) => {
  try {
    const config = await IVRConfig.findOne()
      .populate(
        "selectedExecutives",
        "name role department isActive"
      );

    if (!config) {
      return res.status(200).json({
        success: true,
        config: null,
        message: "No IVR configuration found",
      });
    }

    res.status(200).json({
      success: true,
      config,
    });

  } catch (error) {
    console.error(
      "Get IVR Config Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch IVR configuration",
    });
  }
};


// =========================================
// SAVE / UPDATE IVR CONFIGURATION
// =========================================

const saveIVRConfig = async (req, res) => {
  try {
    const {
      provider,
      ivrNumber,
      isConnected,
      routingMode,
      selectedExecutives,
    } = req.body;

    let config = await IVRConfig.findOne();

    if (config) {

      config.provider =
        provider ?? config.provider;

      config.ivrNumber =
        ivrNumber ?? config.ivrNumber;

      config.isConnected =
        isConnected ?? config.isConnected;

      config.routingMode =
        routingMode ?? config.routingMode;

      config.selectedExecutives =
        selectedExecutives ??
        config.selectedExecutives;

      await config.save();

    } else {

      config = await IVRConfig.create({
        provider: provider || "",
        ivrNumber: ivrNumber || "",
        isConnected: isConnected || false,
        routingMode:
          routingMode || "Round Robin",
        selectedExecutives:
          selectedExecutives || [],
      });

    }

    const populatedConfig =
      await IVRConfig.findById(
        config._id
      ).populate(
        "selectedExecutives",
        "name role department isActive"
      );

    res.status(200).json({
      success: true,
      message:
        "IVR configuration saved successfully",
      config: populatedConfig,
    });

  } catch (error) {
    console.error(
      "Save IVR Config Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save IVR configuration",
      error: error.message,
    });
  }
};


// =========================================
// DISCONNECT IVR
// =========================================

const disconnectIVR = async (req, res) => {
  try {
    const config = await IVRConfig.findOne();

    if (!config) {
      return res.status(404).json({
        success: false,
        message:
          "IVR configuration not found",
      });
    }

    config.isConnected = false;

    await config.save();

    res.status(200).json({
      success: true,
      message:
        "IVR disconnected successfully",
      config,
    });

  } catch (error) {
    console.error(
      "Disconnect IVR Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to disconnect IVR",
    });
  }
};


module.exports = {
  getIVRConfig,
  saveIVRConfig,
  disconnectIVR,
};