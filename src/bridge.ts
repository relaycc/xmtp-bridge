import { Client, DecodedMessage, Conversation } from "@xmtp/xmtp-js";
import { config } from "./config.js";

export const bridge = async () => {
  /*
   * Initialize client
   */

  const client = await Client.create(config.wallet, { env: "production" });

  /*
   * Listen for messages
   */

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
  const addListener = (listener: (msg: DecodedMessage) => void) => {
    listeners.push(listener);
  };

  /*
   * Send messages
   */

  const reply = async ({
    conversation,
    message,
  }: {
    conversation: Conversation;
    message: string;
  }) => {
    return await conversation.send(message);
  };

  return {
    addListener,
    reply,
  };
};
