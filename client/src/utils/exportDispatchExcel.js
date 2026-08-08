import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportDispatchExcel = (dispatches) => {

  const data = dispatches.map((item) => ({
    "Order ID": item.orderId,
    Customer: item.customer,
    Phone: item.phone,
    Product: item.product,
    Quantity: item.quantity,
    Driver: item.driver,
    Vehicle: item.vehicleNumber,
    Tracking: item.trackingNumber,
    Transport: item.transport,
    Priority: item.priority,
    Status: item.status,
    "Dispatch Date": new Date(item.dispatchDate).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Dispatch");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, "Dispatch_Report.xlsx");
};