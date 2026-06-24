import { Worker } from "bullmq";
import IORedis from "ioredis";
import transporter from "../utils/mailer.js";
import Job from "../models/Job.js";
import Campaign from "../models/Campaign.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Prevent duplicate worker initialization if this module is imported more than once
// (e.g., during hot reloads or accidental multiple imports). Uses a global flag
// so the worker is only created once per Node process.
if (!global.__bullmqWorkerStarted) {
  global.__bullmqWorkerStarted = true;

  // Only attempt to connect to MongoDB from the worker if mongoose isn't already connected.
  // The main Express app also calls `connectDB()` so this avoids duplicate connect attempts.
  if (mongoose.connection.readyState !== 1) {
    connectDB();
  }

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

      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error("Campaign not found");
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: campaign.subject,
        text: campaign.content,
        html: campaign.content,
      });

      await Job.findOneAndUpdate(
        { jobId: job.id },
        { status: "delivered", processedAt: new Date() }
      );

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
} else {
  console.log("BullMQ worker already initialized in this process; skipping duplicate init.");
}

