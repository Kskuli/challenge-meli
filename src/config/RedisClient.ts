import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

class RedisClient {
  private static client: any;

  private constructor() {}

  public static getClient() {
    if (!RedisClient.client) {
      const redisHost = process.env.NODE_ENV === 'development' ? 'localhost' : 'redis';
      console.log(`Connecting to Redis at: redis://${redisHost}:6379`);
      RedisClient.client = createClient({ url: `redis://${redisHost}:6379` });
      RedisClient.client.connect().catch((err: Error) => {
        console.error('Error connecting to Redis:', err);
      });
    }
    return RedisClient.client;
  }
}

export default RedisClient;
