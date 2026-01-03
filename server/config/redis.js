import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // enables secure connection for rediss://
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
