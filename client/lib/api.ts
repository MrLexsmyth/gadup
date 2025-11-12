import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
      : process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true, // send cookies for auth
});

export default API;

