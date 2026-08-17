import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { createQuotation } from "../../services/quotationService";
import "./QuotationForm.css";

const QuotationForm = ({ editingData = null, onClose, onCreated }) => {
  // =========================
  // Quotation Information
  // =========================
  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [quotationNumber, setQuotationNumber] = useState("");
  const [validUntil, setValidUntil] = useState("");

  // =========================
  // Client Details
  // =========================
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // =========================
  // Client Remarks
  // =========================
  const [visitBy, setVisitBy] = useState("");
  const [plumbingDetails, setPlumbingDetails] = useState("");

  // =========================
  // Products
  // =========================
  const [items, setItems] = useState([
    {
      id: Date.now(),
      description: "",
      unitPrice: 0,
      quantity: 1,
      rate: 0,
      total: 0,
    },
  ]);

  // =========================
  // Included With Supply
  // =========================
  const [includedItems, setIncludedItems] = useState([
    { id: Date.now(), text: "" },
  ]);

  // =========================
  // Terms & Conditions
  // =========================
  const [terms, setTerms] = useState([
    { id: 1, text: "The system is covered under a 2-year warranty against manufacturing defects." },
    { id: 2, text: "Plumbing work and installation accessories are excluded from the quoted price." },
    { id: 3, text: "The above quotation value is exclusive of GST. GST @ 18% will be charged extra as applicable." },
    { id: 4, text: "Upon Placing the order: 50% of the total Amount." },
    { id: 5, text: "After Successful Installation & Commissioning: 50% of the Remaining Amount." },
  ]);

  // =========================
  // GST & Saving State
  // =========================
  const [gstPercentage, setGstPercentage] = useState(18);
  const [saving, setSaving] = useState(false);

  // =========================
  // Generate Quotation Number
  // =========================
  const generateQuotationNumber = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    setQuotationNumber(`QT-${year}-${randomNumber}`);
  };

  useEffect(() => {
    if (editingData) {
      setQuotationDate(
        editingData.quotationDate || new Date().toISOString().split("T")[0]
      );
      setQuotationNumber(editingData.quotationNumber || "");
      setValidUntil(
        editingData.validUntil ? editingData.validUntil.split("T")[0] : ""
      );
      setClientName(editingData.clientName || editingData.customerName || "");
      setClientAddress(editingData.clientAddress || editingData.address || "");
      setMobileNumber(editingData.mobileNumber || editingData.phone || "");
      setVisitBy(editingData.visitBy || "");
      setPlumbingDetails(editingData.plumbingDetails || "");

      if (editingData.items && editingData.items.length > 0) {
        setItems(
          editingData.items.map((item, index) => ({
            id: item.id || Date.now() + index,
            description: item.description || "",
            unitPrice: Number(item.unitPrice || 0),
            quantity: Number(item.quantity || 1),
            rate: Number(item.rate || item.unitPrice || 0),
            total: Number(
              item.total || (item.quantity || 1) * (item.unitPrice || 0)
            ),
          }))
        );
      }

      if (editingData.includedItems && editingData.includedItems.length) {
        setIncludedItems(
          editingData.includedItems.map((item, index) => ({
            id: Date.now() + index,
            text: typeof item === "string" ? item : item.text || "",
          }))
        );
      }

      if (editingData.terms && editingData.terms.length) {
        setTerms(
          editingData.terms.map((term, index) => ({
            id: Date.now() + index,
            text: typeof term === "string" ? term : term.text || "",
          }))
        );
      }

      setGstPercentage(Number(editingData.gstPercentage ?? 18));
    } else {
      generateQuotationNumber();
    }
  }, [editingData]);

  // =========================
  // Product Functions
  // =========================
  const addProduct = () => {
    setItems((previous) => [
      ...previous,
      {
        id: Date.now(),
        description: "",
        unitPrice: 0,
        quantity: 1,
        rate: 0,
        total: 0,
      },
    ]);
  };

  const removeProduct = (id) => {
    if (items.length === 1) return;
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const updateProduct = (id, field, value) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };

        const quantity = Number(updatedItem.quantity) || 0;
        const unitPrice = Number(updatedItem.unitPrice) || 0;
        const rate = Number(updatedItem.rate) || unitPrice;

        updatedItem.total = quantity * rate;
        return updatedItem;
      })
    );
  };

  // =========================
  // Included Items Functions
  // =========================
  const addIncludedItem = () => {
    setIncludedItems((previous) => [...previous, { id: Date.now(), text: "" }]);
  };

  const updateIncludedItem = (id, text) => {
    setIncludedItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const removeIncludedItem = (id) => {
    setIncludedItems((previous) => previous.filter((item) => item.id !== id));
  };

  // =========================
  // Terms Functions
  // =========================
  const addTerm = () => {
    setTerms((previous) => [...previous, { id: Date.now(), text: "" }]);
  };

  const updateTerm = (id, text) => {
    setTerms((previous) =>
      previous.map((term) => (term.id === id ? { ...term, text } : term))
    );
  };

  const removeTerm = (id) => {
    setTerms((previous) => previous.filter((term) => term.id !== id));
  };

  // =========================
  // Calculations
  // =========================
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const gstAmount = (subtotal * Number(gstPercentage || 0)) / 100;
  const grandTotal = subtotal + gstAmount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // =========================
  // Submit Handler
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===============================
    // VALIDATION
    // ===============================
    if (!clientName.trim()) {
      alert("Please enter Client Name.");
      return;
    }

    if (!mobileNumber.trim()) {
      alert("Please enter Mobile Number.");
      return;
    }

    if (!items.length) {
      alert("Please add at least one product.");
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !item.description?.trim() || Number(item.quantity) <= 0
    );

    if (invalidItem) {
      alert("Please enter product description and valid quantity.");
      return;
    }

    try {
      setSaving(true);

      // ===============================
      // BACKEND PAYLOAD
      // ===============================
      const quotationData = {
        // Quotation
        quotationNumber,
        quotationDate,
        validUntil: validUntil || null,

        // Client
        customerName: clientName.trim(),
        clientName: clientName.trim(),

        phone: mobileNumber.trim(),
        mobileNumber: mobileNumber.trim(),

        address: clientAddress.trim(),
        clientAddress: clientAddress.trim(),

        // Remarks
        visitBy: visitBy.trim(),
        plumbingDetails: plumbingDetails.trim(),

        // Products
        items: items.map((item) => ({
          description: item.description.trim(),
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
          rate: Number(item.rate) || Number(item.unitPrice) || 0,
          total: Number(item.total) || 0,
        })),

        // Included Items
        includedItems: includedItems
          .map((item) => item.text)
          .filter((text) => text.trim() !== ""),

        // Terms
        terms: terms
          .map((term) => term.text)
          .filter((text) => text.trim() !== ""),

        // Amounts
        subtotal: Number(subtotal) || 0,
        gstPercentage: Number(gstPercentage) || 0,
        gstAmount: Number(gstAmount) || 0,
        grandTotal: Number(grandTotal) || 0,

        // Status
        status: "Draft",
      };

      console.log("Sending quotation:", quotationData);

      // ===============================
      // SAVE TO MONGODB
      // ===============================
      const response = await createQuotation(quotationData);

      console.log("Quotation API response:", response);

      // ===============================
      // SUCCESS
      // ===============================
      if (response?.success) {
        alert("Quotation created successfully!");

        // Close + refresh quotation list
        if (onCreated) {
          onCreated(response.data);
        }

        if (onClose) {
          onClose();
        }
      } else {
        alert(response?.message || "Failed to create quotation");
      }
    } catch (error) {
      console.error("Create quotation error:", error);
      console.error("Backend error:", error.response?.data);

      alert(
        error.response?.data?.message || "Failed to create quotation"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="quotation-modal-overlay">
      <div className="quotation-form-card">
        {/* HEADER */}
        <div className="quotation-form-header">
          <div>
            <h2>{editingData ? "Edit Quotation" : "Create Quotation"}</h2>
            <p>Prepare a quotation for your customer.</p>
          </div>
          <button
            type="button"
            className="quotation-close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* QUOTATION INFORMATION */}
          <div className="quotation-form-section">
            <h3>Quotation Information</h3>
            <div className="quotation-form-grid three-columns">
              <div className="quotation-field">
                <label>Date *</label>
                <input
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  required
                />
              </div>

              <div className="quotation-field">
                <label>Quote Number *</label>
                <input
                  type="text"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  required
                />
              </div>

              <div className="quotation-field">
                <label>Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CLIENT DETAILS */}
          <div className="quotation-form-section">
            <h3>Client Details</h3>
            <div className="quotation-form-grid">
              <div className="quotation-field">
                <label>Client Name *</label>
                <input
                  type="text"
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div className="quotation-field">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="quotation-field">
              <label>Address *</label>
              <textarea
                rows="3"
                placeholder="Enter client address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
          </div>

          {/* CLIENT REMARKS */}
          <div className="quotation-form-section">
            <h3>Client Remarks</h3>
            <div className="quotation-form-grid">
              <div className="quotation-field">
                <label>Visit / Sales Executive</label>
                <input
                  type="text"
                  placeholder="Enter executive name"
                  value={visitBy}
                  onChange={(e) => setVisitBy(e.target.value)}
                />
              </div>

              <div className="quotation-field">
                <label>Plumbing / Site Requirement</label>
                <input
                  type="text"
                  placeholder="Example: With plumbing [1.1/2]"
                  value={plumbingDetails}
                  onChange={(e) => setPlumbingDetails(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="quotation-form-section">
            <div className="section-title-row">
              <h3>Products / Items</h3>
              <button
                type="button"
                className="add-product-btn"
                onClick={addProduct}
              >
                <FaPlus /> Add Product
              </button>
            </div>

            <div className="quotation-items">
              {items.map((item) => (
                <div className="quotation-item-row" key={item.id}>
                  <div className="quotation-field product-description">
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Product description"
                      value={item.description}
                      onChange={(e) =>
                        updateProduct(item.id, "description", e.target.value)
                      }
                    />
                  </div>

                  <div className="quotation-field">
                    <label>Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice || ""}
                      onChange={(e) =>
                        updateProduct(
                          item.id,
                          "unitPrice",
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="quotation-field">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateProduct(
                          item.id,
                          "quantity",
                          e.target.value === "" ? 1 : Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="quotation-field">
                    <label>Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={item.rate || ""}
                      onChange={(e) =>
                        updateProduct(
                          item.id,
                          "rate",
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="quotation-field">
                    <label>Total</label>
                    <input
                      type="text"
                      value={formatCurrency(item.total)}
                      readOnly
                    />
                  </div>

                  <button
                    type="button"
                    className="remove-product-btn"
                    onClick={() => removeProduct(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* INCLUDED WITH SUPPLY */}
          <div className="quotation-form-section">
            <div className="section-title-row">
              <h3>Included With Supply</h3>
              <button
                type="button"
                className="add-product-btn"
                onClick={addIncludedItem}
              >
                <FaPlus /> Add Item
              </button>
            </div>

            <div className="included-items">
              {includedItems.map((item) => (
                <div className="included-item-row" key={item.id}>
                  <input
                    type="text"
                    placeholder="Enter included item"
                    value={item.text}
                    onChange={(e) =>
                      updateIncludedItem(item.id, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="remove-product-btn"
                    onClick={() => removeIncludedItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TERMS */}
          <div className="quotation-form-section">
            <div className="section-title-row">
              <h3>Terms & Conditions</h3>
              <button
                type="button"
                className="add-product-btn"
                onClick={addTerm}
              >
                <FaPlus /> Add Term
              </button>
            </div>

            <div className="terms-list">
              {terms.map((term, index) => (
                <div className="term-row" key={term.id}>
                  <span>{index + 1}.</span>
                  <input
                    type="text"
                    value={term.text}
                    onChange={(e) => updateTerm(term.id, e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-product-btn"
                    onClick={() => removeTerm(term.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="quotation-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <div className="summary-row">
              <span>GST (%)</span>
              <input
                type="number"
                min="0"
                value={gstPercentage || ""}
                onChange={(e) =>
                  setGstPercentage(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="summary-row">
              <span>GST Amount</span>
              <strong>{formatCurrency(gstAmount)}</strong>
            </div>

            <div className="grand-total-row">
              <span>Grand Total</span>
              <strong>{formatCurrency(grandTotal)}</strong>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="quotation-form-actions">
            <button
              type="button"
              className="quotation-cancel-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="quotation-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationForm;