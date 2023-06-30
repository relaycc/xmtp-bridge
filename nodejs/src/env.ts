import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";

const zTargetOptions = z.object({
  url: z.string().url(),
  method: z.literal("POST"),
});

const zSentry = z.object({
  dsn: z.string().url(),
});

const zAppEnv = z.object({
  targetOptions: zTargetOptions,
  sentry: zSentry,
  webhookAddress: z.string(),
});

export const app = () => {
  return zAppEnv.parse({
    targetOptions: {
      url: process.env.TARGET_URL,
      method: process.env.TARGET_METHOD,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    webhookAddress: new Wallet(process.env.WEBHOOK_KEY as string).address,
  });
};

export const zApiEnv = z.object({
  url: z.string().url(),
  port: z.string(),
  webhookAddress: z.string(),
  webhookKey: z.string(),
  signupKey: z.string(),
});

export const api = () => {
  return zApiEnv.parse({
    url: process.env.CACHE_URL,
    port: process.env.CACHE_PORT,
    webhookAddress: new Wallet(process.env.WEBHOOK_KEY as string).address,
    webhookKey: process.env.WEBHOOK_KEY,
    signupKey: process.env.SIGNUP_KEY,
  });
};

export const zCanaryEnv = z.object({
  key: z.string(),
});

export const canary = () => {
  return zCanaryEnv.parse({
    key: process.env.CANARY_KEY,
  });
};
