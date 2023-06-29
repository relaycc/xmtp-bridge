import { z } from "zod";
import { app } from "./env.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import fetch from "node-fetch";
import { parse } from "./lib.js";
import { Bridge, reply } from "./bridge.js";

const env = app();

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
}: {
  message: DecodedMessage;
  bridgePeerAddress: string;
}): TargetRequest => {
  return {
    method: env.targetOptions.method,
    headers: {
      "Content-Type": "application/json",
    },
    url: env.targetOptions.url,
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

export const handler = async ({
  message,
  bridge,
}: {
  bridge: Bridge;
  message: DecodedMessage;
}): Promise<void> => {
  if (message.senderAddress === bridge.address) {
    return;
  }

  const request = mapMessageToTargetRequest({
    message,
    bridgePeerAddress: bridge.address,
  });

  const response = await fetch(env.targetOptions.url, {
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

  await reply({ to: message, msg: content });
};
