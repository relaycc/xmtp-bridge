import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import fetch from "node-fetch";
import { parse } from "./lib.js";
import { Bridge, reply } from "./bridge.js";

/* TODO -- This should be documented, HTTP targets MUST accept the following
 * request format. */
export const zTargetRequest = z.object({
  url: z.string(),
  method: z.literal("POST"),
  headers: z.object({
    "Content-Type": z.literal("application/json"),
  }),
  body: z.object({
    bridgePeerAddress: z.string(),
    message: z.object({
      conversation: z.object({
        peerAddress: z.string(),
        context: z
          .object({
            conversationId: z.string(),
          })
          .optional(),
      }),
      content: z.string(),
    }),
  }),
});

export type TargetRequest = z.infer<typeof zTargetRequest>;

export const mapMessageToTargetRequest = ({
  message,
  bridgePeerAddress,
  targetUrl,
}: {
  message: DecodedMessage;
  bridgePeerAddress: string;
  targetUrl: string;
}): TargetRequest => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: targetUrl,
    body: {
      bridgePeerAddress,
      message: {
        conversation: {
          peerAddress: message.senderAddress,
          context: {
            conversationId: message.conversation.peerAddress,
          },
        },
        content: message.content,
      },
    },
  };
};

export const zTargetResponsePayload = z.object({
  ok: z.literal(true),
  data: z.string(),
});

export type TargetResponse = z.infer<typeof zTargetResponsePayload>;

export const zMapTargetResponseToContent = zTargetResponsePayload.transform(
  (val) => {
    return val.data;
  }
);

export const handler =
  ({
    whitelist,
    blacklist,
    targetUrl,
    isBot,
  }: {
    whitelist?: string[];
    blacklist: string[];
    targetUrl: string;
    isBot: boolean;
  }) =>
  async ({
    message,
    bridge,
  }: {
    bridge: Bridge;
    message: DecodedMessage;
  }): Promise<void> => {
    if (blacklist.includes(message.senderAddress)) {
      return;
    }

    if (whitelist !== undefined && !whitelist.includes(message.senderAddress)) {
      return;
    }

    const request = mapMessageToTargetRequest({
      message,
      targetUrl,
      bridgePeerAddress: bridge.address,
    });

    const response = await fetch(targetUrl, {
      headers: request.headers,
      method: request.method,
      body: JSON.stringify(request.body),
    });

    const json = await response.json();

    const content = parse({
      message: "Target response validation failed",
      val: json,
      schema: zMapTargetResponseToContent,
    });

    if (isBot) {
      await reply({ to: message, msg: content });
    } else {
      /* eslint-disable no-console */
      console.log(
        "Forwarded message to target, but not responding because isBot = false"
      );
    }
  };
