import { Redis } from "@upstash/redis";

const redisUrl = process.env.KV_REST_API_URL!;
const redisToken = process.env.KV_REST_API_TOKEN!;

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
