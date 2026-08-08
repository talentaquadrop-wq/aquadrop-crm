import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportDispatchPDF = (dispatches) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AQUA DROP CRM", 14, 18);

  doc.setFontSize(12);
  doc.text("Dispatch Report", 14, 28);

  const tableData = dispatches.map((item) => [
    item.orderId,
    item.customer,
    item.phone,
    item.product,
    item.quantity,
    item.driver,
    item.status,
    new Date(item.dispatchDate).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 38,
    head: [[
      "Order ID",
      "Customer",
      "Phone",
      "Product",
      "Qty",
      "Driver",
      "Status",
      "Date",
    ]],
    body: tableData,
  });

  doc.save("Dispatch_Report.pdf");
};