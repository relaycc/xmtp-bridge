import { z } from "zod";
import { config } from "./config.js";
import fetch from "node-fetch";

export const zValidMessage = z.object({
  senderAddress: z.string().superRefine((val, ctx) => {
    if (val === config.wallet.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender address cannot be the same as the bridge address",
      });
    } else {
      return val;
    }
  }),
  conversation: z.object({
    peerAddress: z.string(),
    context: z
      .object({
        conversationId: z.string(),
      })
      .optional(),
  }),
  content: z.string(),
});

export type ValidMessage = z.infer<typeof zValidMessage>;

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

export const zMapValidMessageToTargetRequest = zValidMessage.transform(
  (val) => {
    return zTargetRequest.parse({
      method: config.targetOptions.method,
      headers: {
        "Content-Type": "application/json",
      },
      url: config.targetOptions.url,
      body: {
        bridgePeerAddress: config.wallet.address,
        message: {
          conversation: {
            peerAddress: val.senderAddress,
            context: {
              conversationId: val.conversation.peerAddress,
            },
          },
          content: val.content,
        },
      },
    });
  }
);

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
