// lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // important if you’re using cookies for auth
});


export default API;
