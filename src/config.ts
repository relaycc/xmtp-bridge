import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";

// TODO - add validation, this schema parses anything.
const zWallet = z.custom<InstanceType<typeof Wallet>>();

export const zConfig = z.object({
  wallet: zWallet,
  targetOptions: z.object({
    url: z.string().url(),
    method: z.literal("POST"),
  }),
  sentry: z.object({
    dsn: z.string().url(),
  }),
});

export const config = zConfig.parse({
  wallet: new Wallet(z.string().parse(process.env.XMTP_PK)),
  targetOptions: {
    url: process.env.TARGET_URL,
    method: process.env.TARGET_METHOD,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
});
