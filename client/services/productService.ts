// services/productService.ts
import API from "../lib/api"; //
import { Product } from "../types/product";

// -------------------- Product Services --------------------

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get<Product[]>("/products");
  return res.data;
};

// Create a new product
export const createProduct = async (product: Product): Promise<Product> => {
  const res = await API.post<Product>("/products", product);
  return res.data;
};

// Update a product
export const updateProduct = async (id: string, product: Product): Promise<Product> => {
  const res = await API.put<Product>(`/products/${id}`, product);
  return res.data;
};

// Delete a product
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const res = await API.delete<{ message: string }>(`/products/${id}`);
  return res.data;
};

// Upload an image
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post<{ url: string }>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url;
};
