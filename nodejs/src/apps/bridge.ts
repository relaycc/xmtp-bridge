import { bridge, addHandler } from "../bridge.js";
import fetch from "node-fetch";
import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";
import { parse } from "../lib.js";
import { app } from "../env.js";
import * as Forward from "../proxy-forward.js";
import * as Reverse from "../proxy-reverse.js";

const env = app();

const zBootResponse = z.object({
  ok: z.literal(true),
  keyToBoot: z.string().refine((val) => {
    new Wallet(val);
    return true;
  }),
});

(async () => {
  const privateKey = await (async () => {
    if (env.bootOptions.mode === "env") {
      return env.bootOptions.fromKey;
    } else {
      const response = await fetch(env.bootOptions.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return parse({
        schema: zBootResponse,
        message: "Boot key response validation failed",
        val: await response.json(),
      }).keyToBoot;
    }
  })();

  const server = await bridge({ privateKey });

  addHandler(server, Forward.handler);
  addHandler(server, Reverse.handler);
})();
