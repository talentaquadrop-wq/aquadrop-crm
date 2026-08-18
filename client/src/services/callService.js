import api from "./api";

// =========================================
// GET ALL CALLS
// =========================================

export const getCalls = async () => {
  const response = await api.get("/calls");

  return response.data;
};


// =========================================
// GET SINGLE CALL
// =========================================

export const getCallById = async (id) => {
  const response = await api.get(
    `/calls/${id}`
  );

  return response.data;
};


// =========================================
// CREATE INCOMING CALL
// =========================================

export const createIncomingCall = async (
  callData
) => {
  const response = await api.post(
    "/calls/incoming",
    callData
  );

  return response.data;
};


// =========================================
// UPDATE CALL
// =========================================

export const updateCall = async (
  id,
  callData
) => {
  const response = await api.put(
    `/calls/${id}`,
    callData
  );

  return response.data;
};