import { bridge, addHandler } from "../bridge.js";
import * as Forward from "../proxy-forward.js";
import * as Reverse from "../proxy-reverse.js";
import { pickBridgeToBoot } from "../boot.js";
import { prisma } from "../db.js";
import { BRIDGE_HEARTBEAT_TIMEOUT_MS } from "../canary.js";

(async () => {
  const bridgeToBoot = await pickBridgeToBoot();

  if (bridgeToBoot === null) {
    /* TODO - Log this. We don't do anything because we assume that we will
     * always have more running containers than bridges to boot. */
  } else {
    (async () => {
      setInterval(async () => {
        prisma.instance.update({
          where: {
            bridgeId: bridgeToBoot.id,
          },
          data: {
            heartbeat: new Date(),
          },
        });
      }, BRIDGE_HEARTBEAT_TIMEOUT_MS / 2);
    })();

    const server = await bridge({ privateKey: bridgeToBoot.bootKey });

    addHandler(server, Forward.handler({ targetUrl: bridgeToBoot.httpUrl }));
    addHandler(server, Reverse.handler);
  }
})();
