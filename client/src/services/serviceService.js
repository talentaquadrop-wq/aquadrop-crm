import api from "./api";

// ===============================
// Get All Services
// ===============================
export const getServices = async () => {
  const response = await api.get("/services");
  return response;
};

// ===============================
// Get Single Service
// ===============================
export const getService = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response;
};

// ===============================
// Create Service
// ===============================
export const createService = async (serviceData) => {
  const response = await api.post(
    "/services",
    serviceData
  );
  return response;
};

// ===============================
// Update Service
// ===============================
export const updateService = async (id, serviceData) => {
  const response = await api.put(
    `/services/${id}`,
    serviceData
  );
  return response;
};

// ===============================
// Delete Service
// ===============================
export const deleteService = async (id) => {
  const response = await api.delete(
    `/services/${id}`
  );
  return response;
};