/* eslint-disable no-console */
import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import * as Protocol from "./protocol.js";
import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";
import fetch from "node-fetch";

/* ****************************************************************************
 *
 * CONFIG
 *
 * ****************************************************************************/

const config = (() => {
  return {
    wallet: new Wallet(z.string().parse(process.env.XMTP_PK)),
    targetUrl: z.string().url().parse(process.env.TARGET_URL),
  };
})();

/* ****************************************************************************
 *
 * XMTP
 *
 * ****************************************************************************/

export const server = async () => {
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

  const sendMessage = async ({
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
    sendMessage,
  };
};

/* ****************************************************************************
 *
 * HANDLER
 *
 * ****************************************************************************/

const mapMessageToRequest: Protocol.MapMessageToTargetRequest = ({
  message,
}) => {
  return Protocol.zTargetRequest.parse({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: config.targetUrl,
    body: {
      bridgePeerAddress: config.wallet.address,
      message: {
        conversation: {
          peerAddress: message.conversation.peerAddress,
          context: message.conversation.context,
        },
        content: message.content,
      },
    },
  });
};

const callHttpApi: Protocol.CallHttpApi = async ({ request }) => {
  try {
    const response = await fetch(config.targetUrl, {
      headers: request.headers,
      method: request.method,
      body: JSON.stringify(request.body),
    });
    const json = await response.json();
    return Protocol.zTargetResponse.parse(json);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const mapResponseToContent: Protocol.MapResponseToContent = ({ response }) => {
  return JSON.stringify(response);
};

const run = async () => {
  const xmtp = await server();
  xmtp.addListener(async (msg) => {
    try {
      Protocol.zHandleableMessage.parse(msg);
      Protocol.zValidMessage.parse(msg);
    } catch (err) {
      return;
    }
    try {
      const request = mapMessageToRequest({ message: msg });
      const response = await callHttpApi({ request });
      Protocol.zTargetResponse.parse(response);
      const content = mapResponseToContent({ response });
      await xmtp.sendMessage({
        conversation: msg.conversation,
        message: content,
      });
    } catch (err) {
      console.error(err);
    }
  });
};

/* ****************************************************************************
 *
 * RUN THE BRIDGE
 *
 * ****************************************************************************/

run();
