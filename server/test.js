// testRedis.js
import redis from './config/redis.js';

redis.ping()
  .then((res) => console.log('Redis says:', res))
  .catch((err) => console.error(err));
