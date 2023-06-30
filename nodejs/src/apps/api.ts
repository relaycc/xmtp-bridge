import express from "express";
import { api } from "../env.js";
import { z } from "zod";
import { parse } from "../lib.js";
import * as Bridge from "../bridge.js";
import { prisma } from "../db.js";
import { Wallet } from "@ethersproject/wallet";
import { v4 as uuid } from "uuid";

const env = api();

const bridge = Bridge.bridge({
  privateKey: env.webhookKey,
});

const app = express();

app.use(express.json());

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

const zSignupBody = z.object({
  key: z.string(),
  httpUrl: z.string(),
});

app.post("/signup", async (req, res) => {
  const validatedBody = parse({
    message: "Signup body validation failed",
    schema: zSignupBody,
    val: req.body,
  });

  if (validatedBody.key !== env.signupKey) {
    console.log("validatedBody.key", validatedBody.key);
    console.log("env.signupKey", env.signupKey);
    res.status(401).send({
      ok: false,
      error: "Invalid key",
    });
    return;
  }

  const wallet = Wallet.createRandom();

  const createdBridge = await prisma.bridge.create({
    data: {
      ethAddress: wallet.address,
      bootKey: wallet.privateKey,
      /* TODO: uuid is not technically cryptographically secure, this is a BIG TODO */
      hookToken: uuid(),
      httpUrl: validatedBody.httpUrl,
    },
  });

  res.send({
    ok: true,
    ethAddress: createdBridge.ethAddress,
    hookToken: createdBridge.hookToken,
  });
});

app.listen(env.port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Boot service listening on port ${env.port}`);
});
