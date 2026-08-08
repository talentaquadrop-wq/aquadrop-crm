import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Aqua Drop CRM", 14, 20);

  doc.setFontSize(14);
  doc.text("Business Report", 14, 30);

  // Date
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

  // Table
  autoTable(doc, {
    startY: 50,
    head: [["Category", "Value"]],
    body: [
      ["Total Revenue", "₹4,85,000"],
      ["Products Sold", "248"],
      ["Customers", "186"],
      ["Services", "74"],
    ],
  });

  doc.save("AquaDrop_Report.pdf");
};

export default exportPDF;