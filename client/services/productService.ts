import axios from "axios";
import { Product } from "../types/product";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token && req.headers) req.headers.Authorization = `Bearer ${token}`;
  return req;
});


export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get<Product[]>("/products"); 
  return res.data;
};

export const createProduct = async (product: Product): Promise<Product> => {
  const res = await API.post<Product>("/products", product);
  return res.data;
};

export const updateProduct = async (id: string, product: Product): Promise<Product> => {
  const res = await API.put<Product>(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const res = await API.delete<{ message: string }>(`/products/${id}`);
  return res.data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post<{ url: string }>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url;
};

