import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportProductsExcel = (products) => {

  const data = products.map((item) => ({
    "Product Name": item.productName,
    Category: item.category,
    SKU: item.sku,
    Brand: item.brand,
    Quantity: item.quantity,
    "Buying Price": item.buyPrice,
    "Selling Price": item.sellPrice,
    Supplier: item.supplier,
    Status: item.status,
    Description: item.description,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Inventory"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, "Inventory_Report.xlsx");
};