import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportLeadsToExcel = (leads) => {
  const data = leads.map((lead) => ({
    "Lead Name": lead.name,
    "Phone": lead.phone,
    "Email": lead.email,
    "Location": lead.location,
    "Product": lead.product,
    "Status": lead.status,
    "Created Date": new Date(lead.createdAt).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(
    file,
    `AquaDrop_Leads_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};