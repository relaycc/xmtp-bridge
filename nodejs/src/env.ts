import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";

const zBootFromNetwork = z.object({
  mode: z.literal("network"),
  url: z.string().url(),
  configFilePath: z.string(),
  port: z.string(),
});

const zBootFromEnv = z.object({
  mode: z.literal("env"),
  fromKey: z.string().refine((val) => {
    try {
      new Wallet(val);
      return true;
    } catch {
      return false;
    }
  }),
});

const zTargetOptions = z.object({
  url: z.string().url(),
  method: z.literal("POST"),
});

const zSentry = z.object({
  dsn: z.string().url(),
});

const zAppEnv = z.object({
  bootOptions: zBootFromNetwork.or(zBootFromEnv),
  targetOptions: zTargetOptions,
  sentry: zSentry,
  webhookAddress: z.string(),
});

export const app = () => {
  return zAppEnv.parse({
    bootOptions: (() => {
      if (process.env.BOOT_MODE === "env") {
        return {
          mode: process.env.BOOT_MODE,
          fromKey: process.env.KEY_TO_BOOT,
        };
      } else {
        return {
          mode: process.env.BOOT_MODE,
          configFilePath: process.env.BOOT_CONFIG_FILE_PATH,
          url: process.env.CACHE_URL,
          port: process.env.CACHE_PORT,
        };
      }
    })(),
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

export const zCacheEnv = z.object({
  bootOptions: zBootFromNetwork,
  webhookAddress: z.string(),
  webhookKey: z.string(),
});

export const api = () => {
  return zCacheEnv.parse({
    bootOptions: {
      mode: process.env.BOOT_MODE,
      configFilePath: process.env.BOOT_CONFIG_FILE_PATH,
      url: process.env.CACHE_URL,
      port: process.env.CACHE_PORT,
    },
    webhookAddress: new Wallet(process.env.WEBHOOK_KEY as string).address,
    webhookKey: process.env.WEBHOOK_KEY,
  });
};
