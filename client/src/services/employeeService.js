import api from "./api";

// ===============================
// GET ALL EMPLOYEES
// ===============================
export const getEmployees = async () => {
  const { data } = await api.get("/employees");
  return data;
};

// ===============================
// GET EXECUTIVES
// ===============================
export const getExecutives = async () => {
  const { data } = await api.get("/employees/executives");
  return data;
};

// ===============================
// CREATE EMPLOYEE
// ===============================
export const createEmployee = async (employee) => {
  const { data } = await api.post("/employees", employee);
  return data;
};

// ===============================
// UPDATE EMPLOYEE
// ===============================
export const updateEmployee = async (id, employee) => {
  const { data } = await api.put(
    `/employees/${id}`,
    employee
  );
  return data;
};

// ===============================
// DELETE EMPLOYEE
// ===============================
export const deleteEmployee = async (id) => {
  const { data } = await api.delete(
    `/employees/${id}`
  );
  return data;
};

// ===============================
// ACTIVATE / DEACTIVATE
// ===============================
export const toggleEmployeeStatus = async (id) => {
  const { data } = await api.patch(
    `/employees/${id}/status`
  );
  return data;
};

// ===============================
// RESET PASSWORD
// ===============================
export const resetEmployeePassword = async (
  id,
  newPassword
) => {
  const { data } = await api.patch(
    `/employees/${id}/reset-password`,
    {
      newPassword,
    }
  );

  return data;
};