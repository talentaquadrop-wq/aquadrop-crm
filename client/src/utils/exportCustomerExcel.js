import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportCustomersToExcel = (customers) => {
  if (!customers || customers.length === 0) {
    alert("No Customer Data Found");
    return;
  }

  const excelData = customers.map((cust, index) => ({
    "S.No": index + 1,
    "Customer Name": cust.name,
    Phone: cust.phone,
    Email: cust.email || "-",
    City: cust.city || "-",
    Address: cust.address || "-",
    Status: cust.status || "Active",
    Product: cust.product || "-",
    Warranty: cust.warranty || "-",
    AMC: cust.amc ? "Yes" : "No",
    Technician: cust.technician || "-",
    Payment: cust.paymentStatus || "-",
    Amount: cust.amount || 0,
    "Installation Date": cust.installationDate
      ? new Date(cust.installationDate).toLocaleDateString()
      : "-",
    "Created Date": new Date(
      cust.createdAt
    ).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Customers"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(
    file,
    `Customers_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`
  );
};