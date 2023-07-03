import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.XMTPB_SENTRY_DSN,
});

export const sentry = Sentry;

const zBridgeEnv = z.object({
  webhookAddress: z.string(),
  bridgeAddress: z.string(),
});

export const bridge = () => {
  return zBridgeEnv.parse({
    bridgeAddress: process.env.XMTPB_BRIDGE_ADDRESS,
    webhookAddress: new Wallet(process.env.XMTPB_WEBHOOK_KEY as string).address,
  });
};

export const zApiEnv = z.object({
  port: z.string(),
  webhookAddress: z.string(),
  webhookKey: z.string(),
  signupKey: z.string(),
});

export const api = () => {
  return zApiEnv.parse({
    port: process.env.XMTPB_API_PORT,
    webhookAddress: new Wallet(process.env.XMTPB_WEBHOOK_KEY as string).address,
    webhookKey: process.env.XMTPB_WEBHOOK_KEY,
    signupKey: process.env.XMTPB_SIGNUP_KEY,
  });
};
