/* eslint-disable no-console */
import express, { Response } from "express";
import * as Env from "../env.js";
import { z } from "zod";
import * as Bridge from "../bridge.js";
import { prisma } from "../db.js";
import { Wallet } from "@ethersproject/wallet";
import { v4 as uuid } from "uuid";

const SIGNUP_KEY = Env.read({ key: "XMTPB_SIGNUP_KEY", schema: z.string() });
const PORT = Env.read({ key: "XMTPB_API_PORT", schema: z.string() });
const WEBHOOK_KEY = Env.read({ key: "XMTPB_WEBHOOK_KEY", schema: z.string() });

const bridge = Bridge.bridge({
  privateKey: WEBHOOK_KEY,
  sentry: Env.sentry,
});

const app = express();

app.use(express.json());

const handleUnknownError = (error: unknown, res: Response) => {
  res.status(500).send({
    ok: false,
    error: (() => {
      if (error instanceof Error) {
        return error;
      } else {
        return new Error("Unknown error");
      }
    })(),
  });
};

app.get("/", async (req, res) => {
  try {
    res.send({
      ok: true,
      data: "Hello from the Relay XMTP Bridge API!",
    });
  } catch (e) {
    handleUnknownError(e, res);
  }
});

const zCanaryBody = z.object({
  message: z.object({
    content: z.string(),
  }),
});

app.post("/canary", async (req, res) => {
  try {
    const validatedBody = zCanaryBody.safeParse(req.body);

    if (!validatedBody.success) {
      res.status(400).send({
        ok: false,
        error: validatedBody.error,
      });
      return;
    }

    res.send({
      ok: true,
      data: `Hello from the proxied server! Your message was: ${validatedBody.data.message.content}`,
    });
  } catch (e) {
    handleUnknownError(e, res);
  }
});

const zHookBody = z.object({
  sendFromBridgeAddress: z.string(),
  targetAddress: z.string(),
  message: z.string(),
  token: z.string(),
});

app.post("/hook", async (req, res) => {
  try {
    const validatedBody = zHookBody.safeParse(req.body);

    if (!validatedBody.success) {
      res.status(400).send({
        ok: false,
        error: validatedBody.error,
      });
      return;
    }

    const bridgeDbo = await prisma.bridge.findUnique({
      where: {
        ethAddress: validatedBody.data.sendFromBridgeAddress,
      },
    });

    if (bridgeDbo === null) {
      res.status(400).send({
        ok: false,
        error: "Bad request",
      });
      return;
    }

    const validTokens = [bridgeDbo.hookToken, SIGNUP_KEY];

    if (!validTokens.includes(validatedBody.data.token)) {
      res.status(401).send({
        ok: false,
        error: "Invalid token",
      });
      return;
    }

    const { send } = await bridge;

    const sent = await send({
      toAddress: validatedBody.data.sendFromBridgeAddress,
      msg: JSON.stringify({
        targetAddress: validatedBody.data.targetAddress,
        message: validatedBody.data.message,
      }),
    });

    res.send({
      ok: true,
      forwardedToBridge: sent.recipientAddress,
      forwardedMessage: {
        id: sent.id,
        content: sent.content,
        recipientAddress: sent.recipientAddress,
      },
    });
  } catch (e) {
    handleUnknownError(e, res);
  }
});

const zSignupBody = z.object({
  key: z.string(),
  forwardHandler: z.object({
    httpUrl: z.string(),
    isBot: z.boolean(),
  }),
});

app.post("/signup", async (req, res) => {
  try {
    const validatedBody = zSignupBody.safeParse(req.body);

    if (!validatedBody.success) {
      console.log("Bad request, malformed body");
      console.log(JSON.stringify(validatedBody.error, null, 2));
      res.status(400).send({
        ok: false,
        error: validatedBody.error,
      });
      return;
    }

    if (validatedBody.data.key !== SIGNUP_KEY) {
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
        forwardHandler: {
          create: validatedBody.data.forwardHandler,
        },
        /* TODO - This is obviously a hack, what to do about it? */
        canaryAddress: "0xf89773CF7cf0B560BC5003a6963b98152D84A15a",
      },
    });

    res.send({
      ok: true,
      ethAddress: createdBridge.ethAddress,
      hookToken: createdBridge.hookToken,
    });
  } catch (e) {
    handleUnknownError(e, res);
  }
});

const zGetInstanceBody = z.object({
  key: z.string(),
  bridgeAddress: z.string(),
});

/* TODO This is a hack because I don't want to use proper auth right now. */
app.post("/instance", async (req, res) => {
  try {
    const validatedBody = zGetInstanceBody.safeParse(req.body);

    if (!validatedBody.success) {
      res.status(400).send({
        ok: false,
        error: validatedBody.error,
      });
      return;
    }

    // TODO SIGNUP_KEY should now really be "API_KEY", so this is a hack.
    if (validatedBody.data.key !== SIGNUP_KEY) {
      res.status(401).send({
        ok: false,
        error: "Invalid key",
      });
      return;
    }

    const instance = await prisma.instance.findFirst({
      where: {
        bridge: {
          ethAddress: validatedBody.data.bridgeAddress,
        },
      },
    });

    res.send({
      ok: true,
      instance,
    });
  } catch (e) {
    handleUnknownError(e, res);
  }
});

app.listen(PORT, () => {
  console.log(`Boot service listening on port ${PORT}`);
});
