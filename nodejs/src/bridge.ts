import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

export type Bridge = {
  address: string;
  listeners: Handler[];
  send: Send;
  sentry: Sentry;
};

export type Sentry = {
  startTransaction: (opts: { name: string }) => {
    finish: () => void;
  };

  captureException: (error: unknown) => void;
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

export const bridge = async (opts: {
  sentry: Sentry;
  privateKey: string;
}): Promise<Bridge> => {
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
    sentry: opts.sentry,
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
    const transaction = bridge.sentry.startTransaction({
      name: "bridge",
    });

    try {
      handler({
        bridge,
        message,
      });
    } catch (error) {
      bridge.sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  });
};
