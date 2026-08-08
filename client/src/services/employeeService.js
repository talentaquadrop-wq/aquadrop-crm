import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ===============================
// Attach JWT Token Automatically
// ===============================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// GET ALL EMPLOYEES
// ===============================
export const getEmployees = async () => {
  const { data } = await API.get("/employees");
  return data;
};

// ===============================
// GET EXECUTIVES
// ===============================
export const getExecutives = async () => {
  const { data } = await API.get("/employees/executives");
  return data;
};

// ===============================
// CREATE EMPLOYEE
// ===============================
export const createEmployee = async (employee) => {
  const { data } = await API.post("/employees", employee);
  return data;
};

// ===============================
// UPDATE EMPLOYEE
// ===============================
export const updateEmployee = async (id, employee) => {
  const { data } = await API.put(`/employees/${id}`, employee);
  return data;
};

// ===============================
// DELETE EMPLOYEE
// ===============================
export const deleteEmployee = async (id) => {
  const { data } = await API.delete(`/employees/${id}`);
  return data;
};

// ===============================
// ACTIVATE / DEACTIVATE
// ===============================
export const toggleEmployeeStatus = async (id) => {
  const { data } = await API.patch(`/employees/${id}/status`);
  return data;
};

// ===============================
// RESET PASSWORD
// ===============================
export const resetEmployeePassword = async (
  id,
  newPassword
) => {
  const { data } = await API.patch(
    `/employees/${id}/reset-password`,
    {
      newPassword,
    }
  );

  return data;
};