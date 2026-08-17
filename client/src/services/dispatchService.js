import api from "./api";

// Fetch dispatch overview stats (Fixes 'getDispatchStats' missing export error 🔥)
export const getDispatchStats = async () => {
  const response = await api.get("/dispatches/stats");
  return response.data;
};

// Fetch all dispatches
export const getDispatches = async () => {
  const response = await api.get("/dispatches");
  return response.data;
};

// Create a new dispatch entry
export const createDispatch = async (dispatchData) => {
  const response = await api.post("/dispatches", dispatchData);
  return response.data;
};

// Update existing dispatch status or details
export const updateDispatch = async (id, dispatchData) => {
  const response = await api.put(`/dispatches/${id}`, dispatchData);
  return response.data;
};

// Delete a dispatch record
export const deleteDispatch = async (id) => {
  const response = await api.delete(`/dispatches/${id}`);
  return response.data;
};