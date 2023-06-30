import { bridge, addHandler } from "../bridge.js";
import fetch from "node-fetch";
import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";
import { parse } from "../lib.js";
import { app } from "../env.js";
import * as Forward from "../proxy-forward.js";
import * as Reverse from "../proxy-reverse.js";
import { pickBridgeToBoot } from "../boot.js";

const env = app();

const zBootResponse = z.object({
  ok: z.literal(true),
  keyToBoot: z.string().refine((val) => {
    new Wallet(val);
    return true;
  }),
});

(async () => {
  const bridgeToBoot = await pickBridgeToBoot();

  if (!bridgeToBoot) {
    throw new Error("No bridge to boot");
  } else {
    const server = await bridge({ privateKey: bridgeToBoot.bootKey });

    addHandler(server, Forward.handler);
    addHandler(server, Reverse.handler);
  }
})();
