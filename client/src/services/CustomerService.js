import axios from "axios";

const API_URL = "http://localhost:5000/api/customers";

// ==============================
// Get All Customers
// ==============================

export const getCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ==============================
// Create Customer
// ==============================

export const createCustomer = async (customerData) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};

// ==============================
// Update Customer
// ==============================

export const updateCustomer = async (id, customerData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    customerData
  );

  return response.data;
};

// ==============================
// Delete Customer
// ==============================

export const deleteCustomer = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};

// ==============================
// Customer Dashboard Stats
// ==============================

export const getCustomerStats = async () => {
  const response = await axios.get(
    `${API_URL}/stats`
  );

  return response.data;
};