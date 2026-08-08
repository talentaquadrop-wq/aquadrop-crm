import api from "./api";

// ===============================
// Get All Installations
// ===============================
export const getInstallations = async () => {
  const response = await api.get("/installations");
  return response;
};

// ===============================
// Get Single Installation
// ===============================
export const getInstallation = async (id) => {
  const response = await api.get(`/installations/${id}`);
  return response;
};

// ===============================
// Create Installation
// ===============================
export const createInstallation = async (installationData) => {
  const response = await api.post(
    "/installations",
    installationData
  );
  return response;
};

// ===============================
// Update Installation
// ===============================
export const updateInstallation = async (id, installationData) => {
  const response = await api.put(
    `/installations/${id}`,
    installationData
  );
  return response;
};

// ===============================
// Delete Installation
// ===============================
export const deleteInstallation = async (id) => {
  const response = await api.delete(
    `/installations/${id}`
  );
  return response;
};