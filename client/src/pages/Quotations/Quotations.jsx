import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileInvoice,
  FaTimes,
  FaDownload,
  FaPrint,
} from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getQuotations,
  deleteQuotation,
  updateQuotationStatus,
} from "../../services/quotationService";

import QuotationForm from "./QuotationForm";

import "./Quotations.css";

const Quotations = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [quotations, setQuotations] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingQuotation, setEditingQuotation] = useState(null);

  const [viewQuotation, setViewQuotation] = useState(null);

  // =========================================================
  // FETCH QUOTATIONS
  // =========================================================

  const fetchQuotations = async () => {
    try {
      setLoading(true);

      const response = await getQuotations();

      if (
        response?.success ||
        Array.isArray(response?.data) ||
        Array.isArray(response)
      ) {
        const data = response?.data || response;

        setQuotations(
          Array.isArray(data) ? data : []
        );
      } else {
        setQuotations([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch quotations:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load quotations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // =========================================================
  // ADD QUOTATION
  // =========================================================

  const handleAddQuotation = () => {
    setEditingQuotation(null);

    setShowForm(true);
  };

  // =========================================================
  // EDIT QUOTATION
  // =========================================================

  const handleEditQuotation = (quotation) => {
    setEditingQuotation(quotation);

    setShowForm(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseForm = () => {
    setShowForm(false);

    setEditingQuotation(null);
  };

  // =========================================================
  // DELETE QUOTATION
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quotation?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteQuotation(id);

      alert(
        "Quotation deleted successfully"
      );

      fetchQuotations();
    } catch (error) {
      console.error(
        "Delete quotation error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete quotation"
      );
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      await updateQuotationStatus(
        id,
        status
      );

      setQuotations((previous) =>
        previous.map((quotation) =>
          quotation._id === id
            ? {
                ...quotation,
                status,
              }
            : quotation
        )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update quotation status"
      );
    }
  };

  // =========================================================
  // CURRENCY FORMAT
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(Number(amount) || 0);
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN"
    );
  };

  // =========================================================
  // PROFESSIONAL PDF
  // =========================================================

  const exportPDF = (quotation) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        doc.internal.pageSize.getWidth();

      // =====================================================
      // HEADER
      // =====================================================

      doc.setFillColor(
        37,
        99,
        235
      );

      doc.rect(
        0,
        0,
        pageWidth,
        12,
        "F"
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFontSize(22);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "AQUA DROP",
        14,
        28
      );

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.text(
        "Water Treatment Solutions",
        14,
        34
      );

      doc.text(
        "Aqua Drop CRM",
        14,
        39
      );

      // =====================================================
      // QUOTATION TITLE
      // =====================================================

      doc.setTextColor(
        37,
        99,
        235
      );

      doc.setFontSize(18);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "QUOTATION",
        pageWidth - 14,
        28,
        {
          align: "right",
        }
      );

      // =====================================================
      // QUOTATION META
      // =====================================================

      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        71,
        85,
        105
      );

      doc.text(
        `Quote No: ${
          quotation.quotationNumber ||
          "-"
        }`,
        pageWidth - 14,
        35,
        {
          align: "right",
        }
      );

      doc.text(
        `Date: ${formatDate(
          quotation.createdAt ||
            new Date()
        )}`,
        pageWidth - 14,
        40,
        {
          align: "right",
        }
      );

      doc.text(
        `Valid Until: ${formatDate(
          quotation.validUntil
        )}`,
        pageWidth - 14,
        45,
        {
          align: "right",
        }
      );

      // =====================================================
      // DIVIDER
      // =====================================================

      doc.setDrawColor(
        226,
        232,
        240
      );

      doc.line(
        14,
        51,
        pageWidth - 14,
        51
      );

      // =====================================================
      // CLIENT DETAILS
      // =====================================================

      doc.setFontSize(12);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.text(
        "CLIENT DETAILS",
        14,
        61
      );

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        71,
        85,
        105
      );

      doc.text(
        `Customer: ${
          quotation.customerName ||
          "-"
        }`,
        14,
        68
      );

      doc.text(
        `Mobile: ${
          quotation.phone ||
          "-"
        }`,
        14,
        74
      );

      doc.text(
        `Email: ${
          quotation.email ||
          "-"
        }`,
        14,
        80
      );

      // =====================================================
      // PRODUCT TABLE
      // =====================================================

      const items =
        quotation.items || [];

      const tableData = items.map(
        (item, index) => {
          const quantity =
            Number(
              item.quantity
            ) || 0;

          const unitPrice =
            Number(
              item.unitPrice
            ) || 0;

          const total =
            quantity *
            unitPrice;

          return [
            index + 1,

            item.description ||
              item.productName ||
              "Product",

            quantity,

            formatCurrency(
              unitPrice
            ),

            formatCurrency(
              total
            ),
          ];
        }
      );

      autoTable(doc, {
        startY: 88,

        margin: {
          left: 14,
          right: 14,
        },

        head: [
          [
            "#",
            "DESCRIPTION",
            "QTY",
            "UNIT PRICE",
            "TOTAL",
          ],
        ],

        body: tableData,

        theme: "grid",

        styles: {
          fontSize: 9,

          cellPadding: 4,

          textColor: [
            51,
            65,
            85,
          ],
        },

        headStyles: {
          fillColor: [
            37,
            99,
            235,
          ],

          textColor: [
            255,
            255,
            255,
          ],

          fontStyle:
            "bold",
        },

        columnStyles: {
          0: {
            cellWidth: 10,
            halign: "center",
          },

          1: {
            cellWidth: 75,
          },

          2: {
            cellWidth: 20,
            halign: "center",
          },

          3: {
            cellWidth: 35,
            halign: "right",
          },

          4: {
            cellWidth: 35,
            halign: "right",
          },
        },
      });

      // =====================================================
      // SUMMARY
      // =====================================================

      let finalY =
        doc.lastAutoTable?.finalY ||
        88;

      finalY += 10;

      const subtotal =
        Number(
          quotation.subtotal
        ) || 0;

      const discountPercent =
        Number(
          quotation.discount
        ) || 0;

      const discountAmount =
        (subtotal *
          discountPercent) /
        100;

      const taxableAmount =
        subtotal -
        discountAmount;

      const taxPercent =
        Number(
          quotation.tax
        ) || 0;

      const taxAmount =
        (taxableAmount *
          taxPercent) /
        100;

      const grandTotal =
        Number(
          quotation.grandTotal
        ) ||
        taxableAmount +
          taxAmount;

      const summaryX =
        pageWidth - 75;

      doc.setFontSize(10);

      doc.setTextColor(
        71,
        85,
        105
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "Subtotal:",
        summaryX,
        finalY
      );

      doc.text(
        formatCurrency(
          subtotal
        ),
        pageWidth - 14,
        finalY,
        {
          align: "right",
        }
      );

      finalY += 7;

      doc.text(
        `Discount (${discountPercent}%):`,
        summaryX,
        finalY
      );

      doc.text(
        formatCurrency(
          discountAmount
        ),
        pageWidth - 14,
        finalY,
        {
          align: "right",
        }
      );

      finalY += 7;

      doc.text(
        `GST (${taxPercent}%):`,
        summaryX,
        finalY
      );

      doc.text(
        formatCurrency(
          taxAmount
        ),
        pageWidth - 14,
        finalY,
        {
          align: "right",
        }
      );

      finalY += 10;

      doc.setFillColor(
        239,
        246,
        255
      );

      doc.roundedRect(
        pageWidth - 90,
        finalY - 6,
        76,
        16,
        3,
        3,
        "F"
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(12);

      doc.setTextColor(
        37,
        99,
        235
      );

      doc.text(
        "GRAND TOTAL",
        summaryX,
        finalY + 1
      );

      doc.text(
        formatCurrency(
          grandTotal
        ),
        pageWidth - 14,
        finalY + 1,
        {
          align: "right",
        }
      );

      // =====================================================
      // INCLUDED WITH SUPPLY
      // =====================================================

      finalY += 28;

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFontSize(12);

      doc.text(
        "INCLUDED WITH SUPPLY",
        14,
        finalY
      );

      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        71,
        85,
        105
      );

      const includedItems = [
        "Aqua Drop Scale Remover Unit",
        "Control Panel Box",
        "Automatic Pump Controller",
        "Dust Filter",
      ];

      includedItems.forEach(
        (item, index) => {
          doc.text(
            `• ${item}`,
            18,
            finalY +
              7 +
              index * 6
          );
        }
      );

      // =====================================================
      // NOTES
      // =====================================================

      finalY +=
        36 +
        includedItems.length *
          2;

      if (
        quotation.notes
      ) {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(11);

        doc.setTextColor(
          15,
          23,
          42
        );

        doc.text(
          "CLIENT REMARKS / NOTES",
          14,
          finalY
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(9);

        doc.setTextColor(
          71,
          85,
          105
        );

        const noteLines =
          doc.splitTextToSize(
            quotation.notes,
            pageWidth - 28
          );

        doc.text(
          noteLines,
          14,
          finalY + 7
        );

        finalY +=
          12 +
          noteLines.length *
            5;
      }

      // =====================================================
      // TERMS & CONDITIONS
      // =====================================================

      if (
        finalY >
        230
      ) {
        doc.addPage();

        finalY = 20;
      }

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(12);

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.text(
        "TERMS & CONDITIONS",
        14,
        finalY
      );

      const terms = [
        "The system is covered under a 2-year warranty against manufacturing defects.",
        "Plumbing work and installation accessories are excluded from the quoted price.",
        "The quotation value is exclusive of GST. GST will be charged extra as applicable.",
        "50% payment upon placing the order.",
        "50% payment after successful installation and commissioning.",
      ];

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.setTextColor(
        71,
        85,
        105
      );

      terms.forEach(
        (term, index) => {
          const lines =
            doc.splitTextToSize(
              `${index + 1}. ${term}`,
              pageWidth - 30
            );

          doc.text(
            lines,
            16,
            finalY +
              8 +
              index * 11
          );
        }
      );

      // =====================================================
      // SIGNATURE
      // =====================================================

      const signatureY =
        Math.min(
          finalY +
            70,
          270
        );

      doc.setDrawColor(
        148,
        163,
        184
      );

      doc.line(
        pageWidth - 70,
        signatureY,
        pageWidth - 14,
        signatureY
      );

      doc.setFontSize(9);

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.text(
        "Authorized Signature",
        pageWidth - 42,
        signatureY + 6,
        {
          align: "center",
        }
      );

      // =====================================================
      // FOOTER
      // =====================================================

      const pageHeight =
        doc.internal.pageSize.getHeight();

      doc.setDrawColor(
        226,
        232,
        240
      );

      doc.line(
        14,
        pageHeight - 18,
        pageWidth - 14,
        pageHeight - 18
      );

      doc.setFontSize(8);

      doc.setTextColor(
        148,
        163,
        184
      );

      doc.text(
        "Thank you for choosing Aqua Drop.",
        14,
        pageHeight - 11
      );

      doc.text(
        "Aqua Drop CRM",
        pageWidth - 14,
        pageHeight - 11,
        {
          align: "right",
        }
      );

      // =====================================================
      // SAVE
      // =====================================================

      const fileName =
        quotation.quotationNumber ||
        "Aqua-Drop-Quotation";

      doc.save(
        `${fileName}.pdf`
      );

    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      alert(
        "Failed to generate quotation PDF."
      );
    }
  };

  // =========================================================
  // PRINT QUOTATION
  // =========================================================

  const printQuotation = (
    quotation
  ) => {
    const items =
      quotation.items || [];

    const subtotal =
      Number(
        quotation.subtotal
      ) || 0;

    const discountPercent =
      Number(
        quotation.discount
      ) || 0;

    const discountAmount =
      (subtotal *
        discountPercent) /
      100;

    const taxableAmount =
      subtotal -
      discountAmount;

    const taxPercent =
      Number(
        quotation.tax
      ) || 0;

    const taxAmount =
      (taxableAmount *
        taxPercent) /
      100;

    const grandTotal =
      Number(
        quotation.grandTotal
      ) ||
      taxableAmount +
        taxAmount;

    const productRows =
      items
        .map(
          (item, index) => {
            const quantity =
              Number(
                item.quantity
              ) || 0;

            const price =
              Number(
                item.unitPrice
              ) || 0;

            const total =
              quantity * price;

            return `
              <tr>
                <td>${index + 1}</td>
                <td>
                  ${
                    item.description ||
                    item.productName ||
                    "Product"
                  }
                </td>
                <td>${quantity}</td>
                <td>${formatCurrency(
                  price
                )}</td>
                <td>${formatCurrency(
                  total
                )}</td>
              </tr>
            `;
          }
        )
        .join("");

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=1000"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the quotation."
      );

      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          ${
            quotation.quotationNumber ||
            "Quotation"
          }
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;

            padding: 30px;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #0f172a;

            background: white;
          }

          .top-bar {
            height: 10px;

            background: #2563eb;

            margin: -30px -30px 30px;
          }

          .header {
            display: flex;

            justify-content:
              space-between;

            align-items: flex-start;

            padding-bottom: 20px;

            border-bottom:
              1px solid #e2e8f0;
          }

          .company h1 {
            margin: 0;

            color: #2563eb;

            font-size: 28px;
          }

          .company p {
            margin: 5px 0;

            color: #64748b;

            font-size: 13px;
          }

          .quote-title {
            text-align: right;
          }

          .quote-title h2 {
            margin: 0;

            color: #2563eb;

            font-size: 24px;
          }

          .quote-title p {
            margin: 5px 0;

            color: #64748b;

            font-size: 12px;
          }

          .section {
            margin-top: 25px;
          }

          .section-title {
            margin-bottom: 10px;

            font-size: 14px;

            font-weight: bold;

            color: #0f172a;
          }

          .client-grid {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 8px;

            padding: 15px;

            background: #f8fafc;

            border-radius: 8px;
          }

          .client-grid p {
            margin: 0;

            font-size: 13px;

            color: #475569;
          }

          table {
            width: 100%;

            border-collapse:
              collapse;

            margin-top: 10px;
          }

          th {
            padding: 10px;

            background: #2563eb;

            color: white;

            font-size: 12px;

            text-align: left;
          }

          td {
            padding: 10px;

            border-bottom:
              1px solid #e2e8f0;

            font-size: 12px;
          }

          .summary {
            width: 320px;

            margin-left: auto;

            margin-top: 20px;
          }

          .summary-row {
            display: flex;

            justify-content:
              space-between;

            padding: 7px 0;

            color: #475569;

            font-size: 13px;
          }

          .grand-total {
            margin-top: 8px;

            padding: 12px;

            display: flex;

            justify-content:
              space-between;

            background: #eff6ff;

            color: #2563eb;

            font-weight: bold;

            font-size: 16px;

            border-radius: 8px;
          }

          .included {
            margin-top: 25px;

            padding: 15px;

            background: #f8fafc;

            border-radius: 8px;
          }

          .included li {
            margin-bottom: 6px;

            font-size: 12px;

            color: #475569;
          }

          .terms {
            margin-top: 25px;
          }

          .terms li {
            margin-bottom: 7px;

            font-size: 12px;

            color: #475569;
          }

          .signature {
            width: 220px;

            margin-left: auto;

            margin-top: 50px;

            text-align: center;

            padding-top: 8px;

            border-top:
              1px solid #94a3b8;

            font-size: 12px;

            color: #64748b;
          }

          .footer {
            margin-top: 35px;

            padding-top: 12px;

            border-top:
              1px solid #e2e8f0;

            display: flex;

            justify-content:
              space-between;

            font-size: 10px;

            color: #94a3b8;
          }

          @media print {

            body {
              padding: 15mm;
            }

            .no-print {
              display: none;
            }

          }

        </style>

      </head>

      <body>

        <div class="top-bar"></div>

        <div class="header">

          <div class="company">

            <h1>AQUA DROP</h1>

            <p>
              Water Treatment Solutions
            </p>

            <p>
              Aqua Drop CRM
            </p>

          </div>

          <div class="quote-title">

            <h2>QUOTATION</h2>

            <p>
              Quote No:
              ${
                quotation.quotationNumber ||
                "-"
              }
            </p>

            <p>
              Date:
              ${formatDate(
                quotation.createdAt ||
                  new Date()
              )}
            </p>

            <p>
              Valid Until:
              ${formatDate(
                quotation.validUntil
              )}
            </p>

          </div>

        </div>


        <div class="section">

          <div class="section-title">
            CLIENT DETAILS
          </div>

          <div class="client-grid">

            <p>
              <strong>
                Customer:
              </strong>
              ${
                quotation.customerName ||
                "-"
              }
            </p>

            <p>
              <strong>
                Mobile:
              </strong>
              ${
                quotation.phone ||
                "-"
              }
            </p>

            <p>
              <strong>
                Email:
              </strong>
              ${
                quotation.email ||
                "-"
              }
            </p>

          </div>

        </div>


        <div class="section">

          <div class="section-title">
            PRODUCT DETAILS
          </div>

          <table>

            <thead>

              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              ${productRows}

            </tbody>

          </table>

        </div>


        <div class="summary">

          <div class="summary-row">
            <span>Subtotal</span>
            <strong>
              ${formatCurrency(
                subtotal
              )}
            </strong>
          </div>

          <div class="summary-row">
            <span>
              Discount (${discountPercent}%)
            </span>
            <strong>
              ${formatCurrency(
                discountAmount
              )}
            </strong>
          </div>

          <div class="summary-row">
            <span>
              GST (${taxPercent}%)
            </span>
            <strong>
              ${formatCurrency(
                taxAmount
              )}
            </strong>
          </div>

          <div class="grand-total">
            <span>
              GRAND TOTAL
            </span>

            <span>
              ${formatCurrency(
                grandTotal
              )}
            </span>
          </div>

        </div>


        <div class="included">

          <div class="section-title">
            INCLUDED WITH SUPPLY
          </div>

          <ul>

            <li>
              Aqua Drop Scale Remover Unit
            </li>

            <li>
              Control Panel Box
            </li>

            <li>
              Automatic Pump Controller
            </li>

            <li>
              Dust Filter
            </li>

          </ul>

        </div>


        ${
          quotation.notes
            ? `
              <div class="section">

                <div class="section-title">
                  CLIENT REMARKS / NOTES
                </div>

                <p style="
                  font-size:12px;
                  color:#475569;
                ">
                  ${quotation.notes}
                </p>

              </div>
            `
            : ""
        }


        <div class="terms">

          <div class="section-title">
            TERMS & CONDITIONS
          </div>

          <ol>

            <li>
              The system is covered under a
              2-year warranty against
              manufacturing defects.
            </li>

            <li>
              Plumbing work and installation
              accessories are excluded from
              the quoted price.
            </li>

            <li>
              The quotation value is
              exclusive of GST. GST will be
              charged extra as applicable.
            </li>

            <li>
              50% payment upon placing
              the order.
            </li>

            <li>
              50% payment after successful
              installation and commissioning.
            </li>

          </ol>

        </div>


        <div class="signature">
          Authorized Signature
        </div>


        <div class="footer">

          <span>
            Thank you for choosing Aqua Drop.
          </span>

          <span>
            Aqua Drop CRM
          </span>

        </div>


        <script>

          window.onload = function() {

            window.print();

          };

        </script>

      </body>

      </html>
    `);

    printWindow.document.close();
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredQuotations =
    quotations.filter(
      (quotation) => {
        const searchText =
          search.toLowerCase();

        const matchesSearch =
          quotation.quotationNumber
            ?.toLowerCase()
            .includes(searchText) ||

          quotation.customerName
            ?.toLowerCase()
            .includes(searchText) ||

          quotation.phone
            ?.toLowerCase()
            .includes(searchText);

        const matchesStatus =
          statusFilter === "All" ||
          quotation.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="quotations-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="quotations-header">

        <div>

          <h1>
            <FaFileInvoice />

            Quotations
          </h1>

          <p>
            Create, manage and track
            customer quotations.
          </p>

        </div>

        <button
          className="add-quotation-btn"
          onClick={
            handleAddQuotation
          }
        >
          <FaPlus />

          Add Quotation
        </button>

      </div>


      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="quotation-toolbar">

        <div className="quotation-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search quotation, customer or phone..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Sent">
            Sent
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Expired">
            Expired
          </option>

          <option value="Converted">
            Converted
          </option>

        </select>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="quotation-table-container">

        <table className="quotation-table">

          <thead>

            <tr>

              <th>
                Quotation
              </th>

              <th>
                Customer
              </th>

              <th>
                Products
              </th>

              <th>
                Total
              </th>

              <th>
                Valid Until
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="7"
                  className="quotation-empty"
                >
                  Loading quotations...
                </td>

              </tr>

            ) : filteredQuotations.length ===
              0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="quotation-empty"
                >

                  <FaFileInvoice />

                  <h3>
                    No quotations found
                  </h3>

                  <p>
                    Create your first
                    quotation to get started.
                  </p>

                </td>

              </tr>

            ) : (

              filteredQuotations.map(
                (quotation) => (

                  <tr
                    key={
                      quotation._id
                    }
                  >

                    <td>

                      <strong>
                        {
                          quotation.quotationNumber ||
                          "N/A"
                        }
                      </strong>

                      <span className="created-date">
                        {formatDate(
                          quotation.createdAt
                        )}
                      </span>

                    </td>


                    <td>

                      <strong>
                        {
                          quotation.customerName ||
                          "N/A"
                        }
                      </strong>

                      <span className="customer-phone">
                        {
                          quotation.phone ||
                          "-"
                        }
                      </span>

                    </td>


                    <td>

                      {
                        quotation.items
                          ?.length || 0
                      }

                      {" "}

                      product
                      {
                        quotation.items
                          ?.length === 1
                          ? ""
                          : "s"
                      }

                    </td>


                    <td>

                      <strong>
                        {formatCurrency(
                          quotation.grandTotal
                        )}
                      </strong>

                    </td>


                    <td>

                      {formatDate(
                        quotation.validUntil
                      )}

                    </td>


                    <td>

                      <select
                        className={`quotation-status ${
                          quotation.status
                            ?.toLowerCase()
                            .replace(
                              " ",
                              "-"
                            )
                        }`}

                        value={
                          quotation.status ||
                          "Draft"
                        }

                        onChange={(e) =>
                          handleStatusChange(
                            quotation._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Draft">
                          Draft
                        </option>

                        <option value="Sent">
                          Sent
                        </option>

                        <option value="Approved">
                          Approved
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                        <option value="Expired">
                          Expired
                        </option>

                        <option value="Converted">
                          Converted
                        </option>

                      </select>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="quotation-actions">

                        {/* VIEW */}

                        <button
                          title="View Details"
                          className="view-btn"
                          onClick={() =>
                            setViewQuotation(
                              quotation
                            )
                          }
                        >
                          <FaEye />
                        </button>


                        {/* PRINT */}

                        <button
                          title="Print Quotation"
                          className="view-btn"
                          onClick={() =>
                            printQuotation(
                              quotation
                            )
                          }
                        >
                          <FaPrint />
                        </button>


                        {/* DOWNLOAD PDF */}

                        <button
                          title="Download PDF"
                          className="view-btn"
                          onClick={() =>
                            exportPDF(
                              quotation
                            )
                          }
                        >
                          <FaDownload />
                        </button>


                        {/* EDIT */}

                        <button
                          title="Edit"
                          className="edit-btn"
                          onClick={() =>
                            handleEditQuotation(
                              quotation
                            )
                          }
                        >
                          <FaEdit />
                        </button>


                        {/* DELETE */}

                        <button
                          title="Delete"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              quotation._id
                            )
                          }
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      {!loading &&
        filteredQuotations.length >
          0 && (

          <div className="quotation-footer">

            Showing{" "}

            <strong>
              {
                filteredQuotations.length
              }
            </strong>

            {" "}

            quotation
            {
              filteredQuotations.length ===
              1
                ? ""
                : "s"
            }

          </div>

        )}


      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {viewQuotation && (

        <div className="quotation-modal-overlay">

          <div className="quotation-modal-content">

            <div className="modal-header">

              <h2>
                Quotation Details
              </h2>

              <button
                onClick={() =>
                  setViewQuotation(
                    null
                  )
                }
              >
                <FaTimes />
              </button>

            </div>


            <div className="view-details">

              <p>
                <strong>
                  Number:
                </strong>{" "}
                {
                  viewQuotation.quotationNumber ||
                  "-"
                }
              </p>

              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {
                  viewQuotation.customerName ||
                  "-"
                }
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{" "}
                {
                  viewQuotation.phone ||
                  "N/A"
                }
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {
                  viewQuotation.email ||
                  "N/A"
                }
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {
                  viewQuotation.status ||
                  "Draft"
                }
              </p>

              <p>
                <strong>
                  Valid Until:
                </strong>{" "}
                {formatDate(
                  viewQuotation.validUntil
                )}
              </p>


              <h3>
                Items
              </h3>

              <ul>

                {(
                  viewQuotation.items ||
                  []
                ).map(
                  (item, index) => (

                    <li key={index}>

                      {
                        item.description ||
                        item.productName ||
                        "Product"
                      }

                      {" - "}

                      {
                        item.quantity
                      }

                      {" × "}

                      {formatCurrency(
                        item.unitPrice
                      )}

                      {" = "}

                      {formatCurrency(
                        (
                          Number(
                            item.quantity
                          ) || 0
                        ) *
                          (
                            Number(
                              item.unitPrice
                            ) || 0
                          )
                      )}

                    </li>

                  )
                )}

              </ul>


              <h3>
                Subtotal:{" "}
                {formatCurrency(
                  viewQuotation.subtotal
                )}
              </h3>

              <h3>
                Grand Total:{" "}
                {formatCurrency(
                  viewQuotation.grandTotal
                )}
              </h3>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          QUOTATION FORM
      ===================================================== */}

      {showForm && (

        <QuotationForm
          editingData={
            editingQuotation
          }

          onClose={
            handleCloseForm
          }

          onCreated={() => {

            handleCloseForm();

            fetchQuotations();

          }}
        />

      )}

    </div>
  );
};

export default Quotations;