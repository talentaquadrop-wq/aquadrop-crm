const mongoose = require("mongoose");
const Quotation = require("../models/Quotation");
const { createAuditLog } = require("./auditController");

// =====================================================
// Generate Quotation Number
// =====================================================

const generateQuotationNumber = async () => {
  const year = new Date().getFullYear();

  const lastQuotation = await Quotation.findOne({
    quotationNumber: new RegExp(`^QT-${year}-`),
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastQuotation?.quotationNumber) {
    const parts = lastQuotation.quotationNumber.split("-");
    const lastNumber = Number(parts[2]);

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `QT-${year}-${String(nextNumber).padStart(4, "0")}`;
};

// =====================================================
// Calculate Item Total
// =====================================================

const calculateItemTotal = (item) => {
  const quantity = Number(item.quantity || 0);
  const unitPrice = Number(item.unitPrice || 0);

  const baseAmount = quantity * unitPrice;

  const discountPercent = Number(item.discount || 0);

  const discountAmount =
    (baseAmount * discountPercent) / 100;

  const afterDiscount =
    baseAmount - discountAmount;

  const taxPercent = Number(item.tax || 0);

  const taxAmount =
    (afterDiscount * taxPercent) / 100;

  return afterDiscount + taxAmount;
};

// =====================================================
// CREATE QUOTATION
// =====================================================

const createQuotation = async (req, res) => {
  try {
    console.log("CREATE QUOTATION REQUEST:");
    console.log(req.body);

    const {
      customer,
      customerName,
      phone,
      email,
      address,
      salesExecutive,
      siteRequirement,
      quoteDate,
      validUntil,
      items,
      discount,
      tax,
      notes,
      status,
    } = req.body;

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one quotation item is required",
      });
    }

    // -----------------------------------------------
    // Process Items
    // -----------------------------------------------

    const processedItems = items.map((item) => {
      const quantity = Number(item.quantity || 1);

      const unitPrice =
        Number(item.unitPrice || 0);

      const itemDiscount =
        Number(item.discount || 0);

      const itemTax =
        Number(item.tax || 0);

      const total = calculateItemTotal({
        quantity,
        unitPrice,
        discount: itemDiscount,
        tax: itemTax,
      });

      return {
        product:
          item.product &&
          mongoose.Types.ObjectId.isValid(item.product)
            ? item.product
            : null,

        productName:
          item.productName ||
          item.description ||
          "",

        description:
          item.description ||
          item.productName ||
          "",

        quantity,

        unitPrice,

        discount: itemDiscount,

        tax: itemTax,

        total,
      };
    });

    // -----------------------------------------------
    // Subtotal
    // -----------------------------------------------

    const subtotal = processedItems.reduce(
      (sum, item) => {
        return (
          sum +
          Number(item.quantity || 0) *
            Number(item.unitPrice || 0)
        );
      },
      0
    );

    // -----------------------------------------------
    // Overall Discount
    // -----------------------------------------------

    const discountPercent =
      Number(discount || 0);

    const discountAmount =
      (subtotal * discountPercent) / 100;

    // -----------------------------------------------
    // Tax
    // -----------------------------------------------

    const taxableAmount =
      subtotal - discountAmount;

    const taxPercent =
      Number(tax || 0);

    const taxAmount =
      (taxableAmount * taxPercent) / 100;

    // -----------------------------------------------
    // Grand Total
    // -----------------------------------------------

    const grandTotal =
      taxableAmount + taxAmount;

    // -----------------------------------------------
    // Customer Reference
    // -----------------------------------------------

    let customerReference = null;

    if (
      customer &&
      mongoose.Types.ObjectId.isValid(customer)
    ) {
      customerReference = customer;
    }

    // -----------------------------------------------
    // Quotation Number
    // -----------------------------------------------

    const quotationNumber =
      await generateQuotationNumber();

    // -----------------------------------------------
    // Create
    // -----------------------------------------------

    const quotation =
      await Quotation.create({
        quotationNumber,

        quoteDate:
          quoteDate || new Date(),

        validUntil:
          validUntil || null,

        customer:
          customerReference,

        customerName:
          customerName.trim(),

        phone:
          phone || "",

        email:
          email || "",

        address:
          address || "",

        salesExecutive:
          salesExecutive || "",

        siteRequirement:
          siteRequirement || "",

        items:
          processedItems,

        subtotal,

        discount:
          discountPercent,

        discountAmount,

        tax:
          taxPercent,

        taxAmount,

        grandTotal,

        notes:
          notes || "",

        status:
          status || "Draft",
      });

    console.log(
      "Quotation created:",
      quotation.quotationNumber
    );

    await createAuditLog({ req, action: "Created", module: "Quotations", entityId: quotation._id, entityName: quotation.quotationNumber, details: `Quotation created for ${quotation.customerName} · ₹${quotation.grandTotal}` });

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully",
      data: quotation,
    });
  } catch (error) {
    console.error(
      "CREATE QUOTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create quotation",
    });
  }
};

// =====================================================
// GET ALL QUOTATIONS
// =====================================================

const getQuotations = async (req, res) => {
  try {
    const quotations =
      await Quotation.find()
        .populate("customer", "name phone email")
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    console.error(
      "GET QUOTATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch quotations",
    });
  }
};

// =====================================================
// GET SINGLE QUOTATION
// =====================================================

const getQuotationById = async (req, res) => {
  try {
    const quotation =
      await Quotation.findById(
        req.params.id
      ).populate(
        "customer",
        "name phone email address"
      );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    console.error(
      "GET QUOTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch quotation",
    });
  }
};

// =====================================================
// UPDATE QUOTATION
// =====================================================

const updateQuotation = async (req, res) => {
  try {
    const quotation =
      await Quotation.findById(
        req.params.id
      );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    const {
      customer,
      customerName,
      phone,
      email,
      address,
      salesExecutive,
      siteRequirement,
      quoteDate,
      validUntil,
      items,
      discount,
      tax,
      notes,
      status,
    } = req.body;

    if (customerName !== undefined) {
      quotation.customerName =
        customerName;
    }

    if (phone !== undefined) {
      quotation.phone = phone;
    }

    if (email !== undefined) {
      quotation.email = email;
    }

    if (address !== undefined) {
      quotation.address = address;
    }

    if (
      salesExecutive !== undefined
    ) {
      quotation.salesExecutive =
        salesExecutive;
    }

    if (
      siteRequirement !== undefined
    ) {
      quotation.siteRequirement =
        siteRequirement;
    }

    if (quoteDate !== undefined) {
      quotation.quoteDate =
        quoteDate;
    }

    if (validUntil !== undefined) {
      quotation.validUntil =
        validUntil;
    }

    if (notes !== undefined) {
      quotation.notes = notes;
    }

    if (status !== undefined) {
      quotation.status = status;
    }

    if (
      customer &&
      mongoose.Types.ObjectId.isValid(customer)
    ) {
      quotation.customer =
        customer;
    }

    // -----------------------------------------------
    // Items + Calculations
    // -----------------------------------------------

    if (Array.isArray(items)) {
      quotation.items =
        items.map((item) => {
          const quantity =
            Number(item.quantity || 1);

          const unitPrice =
            Number(item.unitPrice || 0);

          const itemDiscount =
            Number(item.discount || 0);

          const itemTax =
            Number(item.tax || 0);

          return {
            product:
              item.product &&
              mongoose.Types.ObjectId.isValid(
                item.product
              )
                ? item.product
                : null,

            productName:
              item.productName ||
              item.description ||
              "",

            description:
              item.description ||
              item.productName ||
              "",

            quantity,

            unitPrice,

            discount:
              itemDiscount,

            tax:
              itemTax,

            total:
              calculateItemTotal({
                quantity,
                unitPrice,
                discount:
                  itemDiscount,
                tax:
                  itemTax,
              }),
          };
        });
    }

    const subtotal =
      quotation.items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0) *
            Number(item.unitPrice || 0),
        0
      );

    const discountPercent =
      Number(
        discount !== undefined
          ? discount
          : quotation.discount || 0
      );

    const discountAmount =
      (subtotal * discountPercent) /
      100;

    const taxableAmount =
      subtotal - discountAmount;

    const taxPercent =
      Number(
        tax !== undefined
          ? tax
          : quotation.tax || 0
      );

    const taxAmount =
      (taxableAmount * taxPercent) /
      100;

    const grandTotal =
      taxableAmount + taxAmount;

    quotation.subtotal =
      subtotal;

    quotation.discount =
      discountPercent;

    quotation.discountAmount =
      discountAmount;

    quotation.tax =
      taxPercent;

    quotation.taxAmount =
      taxAmount;

    quotation.grandTotal =
      grandTotal;

    await quotation.save();

    await createAuditLog({ req, action: "Updated", module: "Quotations", entityId: quotation._id, entityName: quotation.quotationNumber, details: `Quotation updated · ₹${quotation.grandTotal}` });

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully",
      data: quotation,
    });
  } catch (error) {
    console.error(
      "UPDATE QUOTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update quotation",
    });
  }
};

// =====================================================
// DELETE
// =====================================================

const deleteQuotation = async (req, res) => {
  try {
    const quotation =
      await Quotation.findByIdAndDelete(
        req.params.id
      );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    await createAuditLog({ req, action: "Deleted", module: "Quotations", entityId: quotation._id, entityName: quotation.quotationNumber, details: "Quotation deleted" });

    return res.status(200).json({
      success: true,
      message:
        "Quotation deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE QUOTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete quotation",
    });
  }
};

// =====================================================
// UPDATE STATUS
// =====================================================

const updateQuotationStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "Draft",
        "Sent",
        "Approved",
        "Rejected",
        "Expired",
        "Converted",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid quotation status",
        });
      }

      const quotation =
        await Quotation.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
          }
        );

      if (!quotation) {
        return res.status(404).json({
          success: false,
          message: "Quotation not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Quotation status updated",
        data: quotation,
      });
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to update quotation status",
      });
    }
  };

module.exports = {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
};