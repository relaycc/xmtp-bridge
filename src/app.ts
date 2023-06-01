import { bridge } from "./bridge.js";
import * as protocol from "./protocol.js";
import fetch from "node-fetch";
import { config } from "./config.js";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: config.sentry.dsn,
});

(async () => {
  const server = await bridge();

  server.addListener(async (message) => {
    const transaction = Sentry.startTransaction({
      name: "bridge",
    });

    try {
      if (message.content === "FAIL") {
        throw new Error("FAIL");
      }

      const messageValiation =
        protocol.zMapValidMessageToTargetRequest.safeParse(message);

      if (!messageValiation.success) {
        return;
      }

      const request = messageValiation.data;

      const response = await fetch(config.targetOptions.url, {
        headers: request.headers,
        method: request.method,
        body: JSON.stringify(request.body),
      });

      const json = await response.json();

      const content = protocol.zMapTargetResponseToContent.parse(json);

      await server.reply({
        conversation: message.conversation,
        message: content,
      });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  });
})();
