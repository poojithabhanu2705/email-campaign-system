import { Queue } from "bullmq";
import IORedis from "ioredis";

import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null,
});

export const jobQueue = new Queue("jobQueue", {
  connection,
});