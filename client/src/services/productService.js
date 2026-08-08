import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// ===============================
// Get All Products
// ===============================
export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// ===============================
// Get Single Product
// ===============================
export const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// ===============================
// Create Product
// ===============================
export const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response;
};

// ===============================
// Update Product
// ===============================
export const updateProduct = async (id, productData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    productData
  );
  return response;
};

// ===============================
// Delete Product
// ===============================
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
};