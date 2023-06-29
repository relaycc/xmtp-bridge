import express from "express";
import { readFileSync } from "fs";
import { api } from "../env.js";
import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";
import { parse } from "../lib.js";
import * as Bridge from "../bridge.js";
import { prisma } from "../db.js";

const env = api();

const bridge = Bridge.bridge({
  privateKey: env.webhookKey,
});

const zBootKeys = z.string().transform((val) => {
  const json = JSON.parse(val);
  const keys = z.array(z.string()).parse(json);
  const wallets = keys.map((key) => new Wallet(key));
  return wallets.map((wallet) => wallet.privateKey);
});

const keysToBoot = parse({
  message: "Boot config file must be a JSON array of private keys",
  schema: zBootKeys,
  val: readFileSync(env.bootOptions.configFilePath).toString(),
});

const KEYS_CACHE = {
  keysToBoot,
};

const app = express();

app.use(express.json());

app.post("/", (_req, res) => {
  res.send({
    ok: true,
    keyToBoot: KEYS_CACHE.keysToBoot.pop(),
  });
});

const zHookBody = z.object({
  fromAddress: z.string(),
  targetAddress: z.string(),
  message: z.string(),
  token: z.string(),
});

app.post("/hook", async (req, res) => {
  const validatedBody = parse({
    message: "Hook body validation failed",
    schema: zHookBody,
    val: req.body,
  });

  const bridgeDbo = await prisma.bridge.findUnique({
    where: {
      ethAddress: validatedBody.fromAddress,
    },
  });

  if (bridgeDbo === null) {
    res.status(400).send({
      ok: false,
      error: "Bad request",
    });
    return;
  }

  if (bridgeDbo.hookToken !== validatedBody.token) {
    res.status(401).send({
      ok: false,
      error: "Invalid token",
    });
    return;
  }

  const { send } = await bridge;

  await send({
    toAddress: validatedBody.fromAddress,
    msg: JSON.stringify({
      targetAddress: validatedBody.targetAddress,
      message: validatedBody.message,
    }),
  });

  res.send({
    ok: true,
    forwardedTo: validatedBody.targetAddress,
    forwardedMessage: validatedBody.message,
  });
});

app.listen(env.bootOptions.port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Boot service listening on port ${env.bootOptions.port}`);
});
