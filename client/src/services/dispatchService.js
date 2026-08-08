import axios from "axios";

const API_URL = "http://localhost:5000/api/dispatch";

// ===============================
// Get All Dispatches
// ===============================

export const getDispatches = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ===============================
// Add Dispatch
// ===============================

export const createDispatch = async (dispatchData) => {
  const response = await axios.post(API_URL, dispatchData);
  return response.data;
};

// ===============================
// Update Dispatch
// ===============================

export const updateDispatch = async (id, dispatchData) => {
  const response = await axios.put(`${API_URL}/${id}`, dispatchData);
  return response.data;
};

// ===============================
// Delete Dispatch
// ===============================

export const deleteDispatch = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// ===============================
// Dashboard Stats
// ===============================

export const getDispatchStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};