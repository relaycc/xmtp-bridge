import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { app } from "./env.js";
import * as Sentry from "@sentry/node";

const env = app();

Sentry.init({
  dsn: env.sentry.dsn,
});

export type Bridge = {
  address: string;
  listeners: Handler[];
  send: Send;
};

export type Send = ({
  toAddress,
  toConversationId,
  msg,
}: {
  toAddress: string;
  toConversationId?: string;
  msg: string;
}) => Promise<void>;

export type Handler = ({
  bridge,
  message,
}: {
  bridge: Bridge;
  message: DecodedMessage;
}) => void;

export const bridge = async (opts: { privateKey: string }): Promise<Bridge> => {
  const wallet = new Wallet(opts.privateKey);
  /* eslint-disable-next-line no-console */
  console.log("address", wallet.address);

  const client = await Client.create(wallet, { env: "production" });

  const listeners: Array<
    ({ message }: { message: DecodedMessage }) => Promise<void>
  > = [];

  (async () => {
    const stream = await client.conversations.streamAllMessages();
    (async () => {
      for await (const message of stream) {
        for (const listener of listeners) {
          listener({ message });
        }
      }
    })();
  })();

  const send: Send = async ({ toAddress, toConversationId, msg }) => {
    console.log("Sending a message using params", {
      fromAddress: client.address,
      toAddress,
      toConversationId,
      msg,
    });
    const conversation = await client.conversations.newConversation(
      toAddress,
      (() => {
        if (toConversationId === undefined) {
          return undefined;
        } else {
          return {
            conversationId: toConversationId,
            metadata: {},
          };
        }
      })()
    );

    await conversation.send(msg);
  };
  return {
    address: client.address,
    send,
    listeners,
  };
};

export const reply = ({ to, msg }: { to: DecodedMessage; msg: string }) => {
  return to.conversation.send(msg);
};

export const addHandler = (bridge: Bridge, handler: Handler) => {
  bridge.listeners.push(({ message }) => {
    const transaction = Sentry.startTransaction({
      name: "bridge",
    });

    try {
      handler({
        bridge,
        message,
      });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  });
};
