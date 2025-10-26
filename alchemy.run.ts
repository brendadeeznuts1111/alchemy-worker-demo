/// <reference types="node" />
import alchemy from "alchemy";
import { Worker } from "alchemy";

export const app = await alchemy("worker-prod-demo", {
  stage: process.env.STAGE || "preview",
});

export const worker = await Worker("worker", {
  // Production flags showcase
  observability: true,        // Auto-scraped Prometheus metrics
  smart_placement: true,      // Respect cf.colo, reduce latency
  cron: "*/5 * * * *",        // Health-check every 5 min
  
  // Durable Objects for alarm functionality
  durable_objects: {
    alarm: true,              // Wake-up alarm for long tasks
  },
  
  // Custom bindings for metrics
  bindings: {
    METRICS: {
      type: "service",
      service: "metrics-collector",
    },
  },
  
  // Source code
  source: "./src/index.ts",
});
