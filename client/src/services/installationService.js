import axios from "axios";

const API_URL = "http://localhost:5000/api/installations";

// ===============================
// Get All Installations
// ===============================
export const getInstallations = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// ===============================
// Get Single Installation
// ===============================
export const getInstallation = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// ===============================
// Create Installation
// ===============================
export const createInstallation = async (installationData) => {
  const response = await axios.post(API_URL, installationData);
  return response;
};

// ===============================
// Update Installation
// ===============================
export const updateInstallation = async (id, installationData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    installationData
  );
  return response;
};

// ===============================
// Delete Installation
// ===============================
export const deleteInstallation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
};