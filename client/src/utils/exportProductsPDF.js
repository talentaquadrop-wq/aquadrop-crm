import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportProductsPDF = (products) => {

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AQUA DROP CRM", 14, 18);

  doc.setFontSize(12);
  doc.text("Inventory Report", 14, 28);

  const tableData = products.map((item) => [

    item.productName,

    item.category,

    item.sku,

    item.brand,

    item.quantity,

    item.buyPrice,

    item.sellPrice,

    item.supplier,

    item.status,

  ]);

  autoTable(doc, {

    startY: 38,

    head: [[

      "Product",

      "Category",

      "SKU",

      "Brand",

      "Qty",

      "Buy",

      "Sell",

      "Supplier",

      "Status",

    ]],

    body: tableData,

    theme: "grid",

    headStyles: {

      fillColor: [37,99,235],

      textColor: [255,255,255],

      fontSize:10,

    },

    styles:{

      fontSize:9,

      cellPadding:3,

    },

  });

  doc.save("Inventory_Report.pdf");

};