import api from "./api";

// ======================================
// GET ALL
// ======================================

export const getQuotations = async () => {
  const response = await api.get(
    "/quotations"
  );

  return response.data;
};

// ======================================
// GET SINGLE
// ======================================

export const getQuotationById =
  async (id) => {
    const response = await api.get(
      `/quotations/${id}`
    );

    return response.data;
  };

// ======================================
// CREATE
// ======================================

export const createQuotation =
  async (data) => {
    const response = await api.post(
      "/quotations",
      data
    );

    return response.data;
  };

// ======================================
// UPDATE
// ======================================

export const updateQuotation =
  async (id, data) => {
    const response = await api.put(
      `/quotations/${id}`,
      data
    );

    return response.data;
  };

// ======================================
// DELETE
// ======================================

export const deleteQuotation =
  async (id) => {
    const response = await api.delete(
      `/quotations/${id}`
    );

    return response.data;
  };

// ======================================
// STATUS
// ======================================

export const updateQuotationStatus =
  async (id, status) => {
    const response = await api.patch(
      `/quotations/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  };