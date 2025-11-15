// backend/config/cors.js
export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://gadup.vercel.app",   // your frontend
  ],
  credentials: true,             // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
