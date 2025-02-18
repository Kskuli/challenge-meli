import RedisClient from "../config/RedisClient";

const redisClient = RedisClient.getClient();

export const setCache = async (key: string, value: any) => {
  await redisClient.set(key, JSON.stringify(value));
};

export const getCache = async (key: string) => {
  const cachedData = await redisClient.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};