const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const mongoose = require("mongoose");

// ==============================
// Get All Leads (Role-Based)
// ==============================
exports.getLeads = async (req, res) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;

    console.log("========== GET LEADS ==========");
    console.log("Logged User ID :", userId);
    console.log("Logged User Role :", userRole);

    let query = {};

    // Executives / Telecallers can only see their own assigned leads
    if (userRole !== "Admin" && userRole !== "Manager") {
      query.assignedTo = userId;
    }

    console.log("Applied Query :", query);

    const leads = await Lead.find(query)
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Leads Count :", leads.length);

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

// ==============================
// Get Lead By ID
// ==============================
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lead ID format.",
      });
    }

    const lead = await Lead.findById(id).populate("assignedTo", "name role");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    if (
      req.user?.role !== "Admin" &&
      req.user?.role !== "Manager"
    ) {
      if (lead.assignedTo?._id?.toString() !== req.user?._id?.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this lead.",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get Lead Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead.",
    });
  }
};

// ==============================
// Create New Lead
// ==============================
exports.createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      alternatePhone,
      email,
      address,
      city,
      pincode,
      tds,
      waterSource,
      familyMembers,
      source,
      product,
      budget,
      status,
      priority,
      assignedTo,
      assignedTelecaller,
      assignedAgent,
      followUpDate,
      lastFollowUp,
      siteVisitRequired,
      remarks,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and Phone are required fields.",
      });
    }

    let assignedEmployee = assignedTo;

    if (
      req.user?.role !== "Admin" &&
      req.user?.role !== "Manager"
    ) {
      assignedEmployee = req.user?._id;
    } else {
      if (!assignedTo || typeof assignedTo !== "string" || assignedTo.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Please select an employee to assign this lead.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned employee ID format.",
        });
      }
    }

    const existingLead = await Lead.findOne({ phone });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "A lead with this phone number already exists.",
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      alternatePhone,
      email,
      address,
      city,
      pincode,
      tds,
      waterSource,
      familyMembers,
      source,
      product,
      budget,
      status,
      priority,
      assignedTo: assignedEmployee,
      createdBy: req.user?._id,
      assignedTelecaller,
      assignedAgent,
      followUpDate,
      lastFollowUp,
      siteVisitRequired,
      remarks,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create lead.",
    });
  }
};

// ==============================
// Update Lead
// ==============================
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lead ID format.",
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const updates = { ...req.body };

    if (
      req.user?.role !== "Admin" &&
      req.user?.role !== "Manager"
    ) {
      if (lead.assignedTo?.toString() !== req.user?._id?.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }
      delete updates.assignedTo;
      delete updates.createdBy;
    }

    if (updates.assignedTo === "" || updates.assignedTo === null) {
      delete updates.assignedTo;
    }

    if (updates.phone) {
      const existingLead = await Lead.findOne({
        phone: updates.phone,
        _id: { $ne: id },
      });

      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: "Another lead already exists with this phone number.",
        });
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignedTo", "name role");

    res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lead.",
    });
  }
};

// ==============================
// Delete Lead (Admin / Manager Only)
// ==============================
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lead ID format.",
      });
    }

    if (
      req.user?.role !== "Admin" &&
      req.user?.role !== "Manager"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Admins and Managers can delete leads.",
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    await Lead.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete lead.",
    });
  }
};

// ==============================
// Convert Lead to Customer (Admin / Manager Only)
// ==============================
exports.convertLeadToCustomer = async (req, res) => {
  if (
    req.user?.role !== "Admin" &&
    req.user?.role !== "Manager"
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only Admins and Managers can convert leads to customers.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid Lead ID format.",
      });
    }

    const lead = await Lead.findById(id).session(session);

    if (!lead) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    if (lead.isConverted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Lead is already converted.",
      });
    }

    const [customer] = await Customer.create(
      [
        {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          address: lead.address,
          city: lead.city,
          pincode: lead.pincode,
          status: "Active",
          createdBy: lead.createdBy || req.user?._id,
          assignedTo: lead.assignedTo || req.user?._id,
        },
      ],
      { session }
    );

    lead.isConverted = true;
    lead.status = "Won";
    lead.convertedCustomer = customer._id;
    lead.convertedAt = new Date();

    await lead.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Lead converted to Customer successfully.",
      data: customer,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Convert Lead Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to convert lead to customer.",
    });
  }
};