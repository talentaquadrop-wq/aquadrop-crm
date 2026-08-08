import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportCustomersToPDF = (customers) => {
  if (!customers || customers.length === 0) {
    alert("No Customer Data");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AQUA DROP WATER SOLUTIONS", 14, 20);

  doc.setFontSize(13);
  doc.text("Customers Report", 14, 30);

  doc.setFontSize(10);
  doc.text(
    `Generated On : ${new Date().toLocaleString()}`,
    14,
    38
  );

  const rows = customers.map((cust, index) => [
    index + 1,
    cust.name,
    cust.phone,
    cust.city || "-",
    cust.product || "-",
    cust.status || "Active",
    cust.amount || 0,
  ]);

  autoTable(doc, {
    startY: 45,

    head: [[
      "S.No",
      "Customer",
      "Phone",
      "City",
      "Product",
      "Status",
      "Amount",
    ]],

    body: rows,

    styles: {
      fontSize: 9,
    },

    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  doc.save(
    `Customers_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
};