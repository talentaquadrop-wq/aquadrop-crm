import api from "./api";

// ===============================
// Get All Products
// ===============================
export const getProducts = async () => {
  const response = await api.get("/products");
  return response;
};

// ===============================
// Get Single Product
// ===============================
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response;
};

// ===============================
// Create Product
// ===============================
export const createProduct = async (productData) => {
  const response = await api.post(
    "/products",
    productData
  );
  return response;
};

// ===============================
// Update Product
// ===============================
export const updateProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );
  return response;
};

// ===============================
// Delete Product
// ===============================
export const deleteProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );
  return response;
};