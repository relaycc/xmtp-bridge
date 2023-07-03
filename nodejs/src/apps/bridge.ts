import { bridge, addHandler } from "../bridge.js";
import * as Forward from "../proxy-forward.js";
import * as Reverse from "../proxy-reverse.js";
import { prisma } from "../db.js";
import { BRIDGE_HEARTBEAT_TIMEOUT_MS } from "../canary.js";
import * as Env from "../env.js";

const env = Env.bridge();

(async () => {
  const bridgeConfig = await prisma.bridge.findUnique({
    where: {
      ethAddress: env.bridgeAddress,
    },
  });

  if (bridgeConfig === null) {
    /* eslint-disable-next-line no-console */
    console.log("Bridge not found " + env.bridgeAddress);
    throw new Error("Bridge not found " + env.bridgeAddress);
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

    addHandler(
      server,
      Forward.handler({
        blacklist: [env.webhookAddress, server.address],
        targetUrl: bridgeConfig.httpUrl,
      })
    );
    addHandler(server, Reverse.handler({ whitelist: [env.webhookAddress] }));
  }
})();

/* eslint-disable-next-line no-console */
console.log("Bridge started");
