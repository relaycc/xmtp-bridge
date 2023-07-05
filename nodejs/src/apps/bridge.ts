import { z } from "zod";
import { bridge, addHandler } from "../bridge.js";
import * as Forward from "../proxy-forward.js";
import * as Reverse from "../proxy-reverse.js";
import { prisma } from "../db.js";
import { BRIDGE_HEARTBEAT_TIMEOUT_MS } from "../canary.js";
import * as Env from "../env.js";
import { Wallet } from "@ethersproject/wallet";

const BRIDGE_ADRESS = Env.read({
  key: "XMTPB_BRIDGE_ADDRESS",
  schema: z.string(),
});

const WEBHOOK_ADDRESS = (() => {
  const key = Env.read({ key: "XMTPB_WEBHOOK_KEY", schema: z.string() });
  return new Wallet(key).address;
})();

(async () => {
  const bridgeConfig = await prisma.bridge.findUnique({
    where: {
      ethAddress: BRIDGE_ADRESS,
    },
    include: {
      forwardHandler: true,
    },
  });

  if (bridgeConfig === null) {
    /* eslint-disable-next-line no-console */
    console.log(
      "Bridge for address " + BRIDGE_ADRESS + "was not found in the database."
    );
    throw new Error("Bridge not found " + BRIDGE_ADRESS);
  } else {
    (async () => {
      setInterval(async () => {
        prisma.instance.update({
          where: {
            bridgeId: bridgeConfig.id,
          },
          data: {
            heartbeat: new Date(),
          },
        });
      }, BRIDGE_HEARTBEAT_TIMEOUT_MS / 2);
    })();

    const server = await bridge({
      sentry: Env.sentry,
      privateKey: bridgeConfig.bootKey,
    });

    /*
     * Canary proxy
     */

    addHandler(
      server,
      Forward.handler({
        whitelist: [bridgeConfig.canaryAddress],
        blacklist: [],
        // TODO - This is clearly a hack, what to do about it?
        targetUrl: "https://api.bridge.relay.network/canary",
        isBot: true,
      })
    );

    /*
     * Primary (XMTP -> HTTP) proxy
     */

    addHandler(
      server,
      Forward.handler({
        blacklist: [
          bridgeConfig.canaryAddress,
          server.address,
          WEBHOOK_ADDRESS,
        ],
        targetUrl: bridgeConfig.forwardHandler.httpUrl,
        isBot: bridgeConfig.forwardHandler.isBot,
      })
    );

    /*
     * Webhook (HTTP -> XMTP) proxy
     */

    addHandler(server, Reverse.handler({ whitelist: [WEBHOOK_ADDRESS] }));
  }
})();

/* eslint-disable-next-line no-console */
console.log("Bridge started");
