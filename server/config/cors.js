// backend/config/cors.js
export const corsOptions = {
   origin: [
    "https://gadup.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,             // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
