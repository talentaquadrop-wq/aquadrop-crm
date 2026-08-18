import api from "./api";

// =========================================
// GET IVR CONFIGURATION
// =========================================

export const getIVRConfig = async () => {
  const response = await api.get("/ivr");

  return response.data;
};


// =========================================
// SAVE / UPDATE IVR CONFIGURATION
// =========================================

export const saveIVRConfig = async (data) => {
  const response = await api.post(
    "/ivr",
    data
  );

  return response.data;
};


// =========================================
// DISCONNECT IVR
// =========================================

export const disconnectIVR = async () => {
  const response = await api.put(
    "/ivr/disconnect"
  );

  return response.data;
};