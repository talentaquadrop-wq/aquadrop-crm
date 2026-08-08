import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

// ===============================
// Get All Services
// ===============================
export const getServices = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// ===============================
// Get Single Service
// ===============================
export const getService = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// ===============================
// Create Service
// ===============================
export const createService = async (serviceData) => {
  const response = await axios.post(API_URL, serviceData);
  return response;
};

// ===============================
// Update Service
// ===============================
export const updateService = async (id, serviceData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    serviceData
  );

  return response;
};

// ===============================
// Delete Service
// ===============================
export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
};