import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportLeadsToPDF = (leads) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Aqua Drop CRM - Leads Report", 14, 18);

  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  const rows = leads.map((lead) => [
    lead.name,
    lead.phone,
    lead.location,
    lead.product,
    lead.status,
  ]);

  autoTable(doc, {
    startY: 32,
    head: [["Name", "Phone", "Location", "Product", "Status"]],
    body: rows,
  });

  doc.save("AquaDrop_Leads_Report.pdf");
};