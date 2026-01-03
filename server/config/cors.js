export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://gadup.vercel.app",
      "https://gadup.onrender.com",
      "http://localhost:3000",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"], // ❌ removed to allow all headers
  // preflightContinue: false, // ❌ unnecessary since OPTIONS is allowed
};
