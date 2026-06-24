import { Worker } from "bullmq";
import IORedis from "ioredis";
import Job from "../models/Job.js";
import Campaign from "../models/Campaign.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "jobQueue",
  async (job) => {
    const { campaignId, recipientEmail } = job.data;
    
    console.log(`Processing email for ${recipientEmail} (Campaign: ${campaignId})`);

    // Update status to active
    await Job.findOneAndUpdate(
      { jobId: job.id },
      { status: "active", processedAt: new Date() }
    );

    // Simulate realistic processing delay (1-3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    await new Promise((res) => setTimeout(res, delay));

    // Simulate random failure (15% chance for demo)
    const isFailed = Math.random() < 0.15;
    
    if (isFailed) {
      const errorReasons = [
        "SMTP Timeout",
        "Invalid Recipient Address",
        "Rate Limit Exceeded",
        "Mail Server Rejected",
        "DNS Resolution Failed"
      ];
      const reason = errorReasons[Math.floor(Math.random() * errorReasons.length)];
      throw new Error(reason);
    }

    // Success logic
    await Job.findOneAndUpdate(
      { jobId: job.id },
      { status: "delivered", processedAt: new Date() }
    );

    // Update Campaign counts
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { sentCount: 1 }
    });

    console.log(`✓ Delivered: ${recipientEmail}`);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  console.log(`✗ Failed: ${job.id} - ${err.message}`);
  
  const { campaignId } = job.data;
  const isFinalFailure = job.attemptsMade >= job.opts.attempts;

  await Job.findOneAndUpdate(
    { jobId: job.id },
    { 
      status: isFinalFailure ? "failed" : "retrying",
      failureReason: err.message,
      retryCount: job.attemptsMade
    }
  );

  if (isFinalFailure) {
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { failedCount: 1 }
    });
  }
});

// Update Campaign to completed if all jobs are done
worker.on("drained", async () => {
   // This is a bit complex to do per-campaign in a generic way here, 
   // but for the demo we can just check all jobs for a campaign when one completes.
   // Simplified: Campaigns remain in 'processing' status in this demo for UX.
});

