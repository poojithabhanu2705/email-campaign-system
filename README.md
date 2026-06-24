# Holden - Scalable Job Queue System

A scalable backend job processing system built using Node.js, Express, BullMQ, Redis, and MongoDB.

This project demonstrates how modern backend systems handle asynchronous tasks such as emails, notifications, and payments using queues, workers, retries, priorities, and distributed processing.

---

# Features

* Asynchronous job processing using BullMQ
* Redis-backed queue system
* MongoDB job persistence and tracking
* Multiple job types
* Delayed jobs
* Automatic retries with backoff
* Priority-based job execution
* Multiple worker support
* Job lifecycle tracking
* Queue event listeners
* REST APIs for querying jobs
* Scalable architecture

---

# Tech Stack

* Node.js
* Express.js
* BullMQ
* Redis
* MongoDB Atlas
* Mongoose

---

# System Architecture

```text
Client
   ↓
Express API Server
   ↓
BullMQ Queue (Redis)
   ↓
Workers
   ↓
MongoDB
```

---

# Project Structure

```text
job-queue-system/
│
├── config/
│   └── db.js
│
├── models/
│   └── Job.js
│
├── queue/
│   └── queue.js
│
├── routes/
│   └── jobRoutes.js
│
├── worker/
│   └── worker.js
│
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

---

# How It Works

1. Client sends a request to create a job.
2. Express API adds the job to BullMQ.
3. BullMQ stores the job in Redis.
4. Workers consume jobs asynchronously.
5. MongoDB tracks job state and metadata.
6. Failed jobs retry automatically.
7. APIs expose job information externally.

---

# Job Lifecycle

```text
waiting → active → completed
```

or

```text
waiting → active → failed
```

---

# Supported Features

## Delayed Jobs

Jobs can be scheduled to execute after a delay.

## Retries and Backoff

Failed jobs retry automatically with configurable delay.

## Priority Jobs

Higher priority jobs are processed before lower priority jobs.

## Multiple Workers

The system supports horizontal scaling by running multiple workers.

## Persistent Tracking

MongoDB stores job information permanently for querying and monitoring.

---

# API Endpoints

## Add Job

```http
POST /jobs/add-job
```

Example Request:

```json
{
  "type": "email",
  "data": {
    "email": "test@gmail.com"
  },
  "priority": 1
}
```

---

## Get All Jobs

```http
GET /jobs/all
```

---

## Get Job By ID

```http
GET /jobs/:id
```

---

## Get Jobs By Status

```http
GET /jobs/status/:status
```

Example:

```http
GET /jobs/status/completed
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/poojithabhanu2705/scalable-job-queue-system.git
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file with Gmail SMTP settings:

```env
MONGO_URI=your_mongodb_connection_string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-gmail-address@gmail.com
```

### Gmail App Password

1. Enable 2-Step Verification on your Google account.
2. Go to Google Account > Security > App passwords.
3. Create an app password for Mail and copy it.
4. Use the generated password as `SMTP_PASS`.

---

## 4. Start Redis

```bash
redis-server
```

---

## 5. Start API Server

```bash
node app.js
```

---

## 6. Start Worker

```bash
node worker/worker.js
```

---

# Future Improvements

* Frontend dashboard for monitoring jobs
* Real-time updates using WebSockets
* Authentication and authorization
* Rate limiting
* Docker deployment
* Kubernetes scaling
* Dead letter queues
* Monitoring with Prometheus/Grafana

---

# Key Backend Concepts Demonstrated

* Producer-consumer architecture
* Distributed job processing
* Queue-based asynchronous systems
* Retry mechanisms
* Event-driven systems
* Horizontal scalability
* Persistence and system state tracking
* Worker orchestration

---




