import rateLimit from "express-rate-limit";

// LOGIN: prevent brute-force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: {
    message: "Too many login attempts. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// SIGNUP: prevent bot registrations
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many signup attempts. Please try again later.",
  },
});

// GENERAL (optional, light)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
