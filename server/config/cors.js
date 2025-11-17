export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://gadup-1.onrender.com",
      "https://gadup.onrender.com",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ must be true
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
