import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { app } from "./env.js";
import * as Sentry from "@sentry/node";

const env = app();

Sentry.init({
  dsn: env.sentry.dsn,
});

export type Listener = ({
  message,
  server,
}: {
  message: DecodedMessage;
  server: { address: string; reply: (msg: string) => Promise<void> };
}) => void;

export const bridge = async (opts: { privateKey: string }) => {
  const wallet = new Wallet(opts.privateKey);
  /* eslint-disable-next-line no-console */
  console.log("address", wallet.address)

  const client = await Client.create(wallet, { env: "production" });

  const listeners: Array<(msg: DecodedMessage) => void> = [];
  (async () => {
    const stream = await client.conversations.streamAllMessages();
    (async () => {
      for await (const message of stream) {
        for (const listener of listeners) {
          listener(message);
        }
      }
    })();
  })();

  const addListener = (listener: Listener) => {
    listeners.push((message) => {
      const transaction = Sentry.startTransaction({
        name: "bridge",
      });

      try {
        listener({
          message,
          server: {
            address: client.address,
            reply: async (msg) => {
              await message.conversation.send(msg);
            },
          },
        });
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        transaction.finish();
      }
    });
  };

  return {
    address: client.address,
    addListener,
  };
};
